import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { createSession, destroySessionByToken } from "../services/session.service.js";
import { sendRegistrationOtpService,sendPasswordResetOtpService,verifyRegistrationOtpService, verifyPasswordResetOtpService } from "../services/email.service.js";

const setRefreshCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: "Fill in all fields" });

        const isAlreadyRegistered = await userModel.findOne({ $or: [{ username }, { email }] });
        if (isAlreadyRegistered) return res.status(409).json({ message: "Username or email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await sendRegistrationOtpService(username, email, hashedPassword);

        res.status(200).json({
            message: "OTP sent to your email. Please verify to complete registration.",
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        const pendingData = await verifyRegistrationOtpService(email, otp);
        if (!pendingData) return res.status(400).json({ message: "Invalid or expired OTP" });

        const user = await userModel.create({
            username: pendingData.username,
            email: pendingData.email,
            password: pendingData.password
        });

        const { accessToken, refreshToken } = await createSession(user._id, req.ip, req.headers["user-agent"]);
        setRefreshCookie(res, refreshToken);

        res.status(201).json({ 
            message: "Registration successful and verified",
            user: { username: user.username, email: user.email },
            accessToken
        });
    } catch (error) {
        res.status(500).json({ message: `Internal server error during verification: ${error.message}` });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Provide email and password" });

        const user = await userModel.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await createSession(user._id, req.ip, req.headers["user-agent"]);
        setRefreshCookie(res, refreshToken);

        res.status(200).json({
            message: "Logged in successfully",
            user: { username: user.username, email: user.email },
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error during login" });
    }
};


export const getMe = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) return res.status(401).json({ message: "Access token not found" });

        const decoded = jwt.verify(accessToken, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User fetched", user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired access token" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) return res.status(401).json({ message: "Refresh token not found" });

        const decoded = jwt.verify(oldRefreshToken, config.JWT_SECRET);
        
        const sessionDestroyed = await destroySessionByToken(decoded.id, oldRefreshToken);
        if (!sessionDestroyed) return res.status(401).json({ message: "Session is invalid or expired" });

        const { accessToken, refreshToken: newRefreshToken } = await createSession(decoded.id, req.ip, req.headers["user-agent"]);
        setRefreshCookie(res, newRefreshToken);

        res.status(200).json({ message: "Tokens refreshed successfully", accessToken });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ message: "No active session found" });

        const decoded = jwt.decode(refreshToken);
        if (decoded?.id) {
            await destroySessionByToken(decoded.id, refreshToken);
        }

        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "strict" });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error during logout" });
    }
};

export const logoutAllDevices = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(400).json({ message: "No active session found" });

        const decoded = jwt.decode(refreshToken);
        if (decoded?.id) {
            await sessionModel.deleteMany({ user: decoded.id });
        }

        res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "strict" });
        res.status(200).json({ message: "Logged out of all devices" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error during global logout" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "This email is not registered" });
        }

        await sendPasswordResetOtpService(email);

        res.status(200).json({ message: "OTP sent to your email successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }

        const isValid = await verifyPasswordResetOtpService(email, otp);
        if (!isValid) return res.status(400).json({ message: "Invalid or expired reset code" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await userModel.findOneAndUpdate(
            { email }, 
            { password: hashedPassword },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        await sessionModel.deleteMany({ user: user._id });

        res.status(200).json({ message: "Password has been reset successfully. Please log in again." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error during password reset" });
    }
};

