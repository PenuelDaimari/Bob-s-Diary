import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sessionModel from "../models/session.model.js";
import config from "../config/config.js";

export const createSession = async (userId, ip, userAgent) => {
    const refreshToken = jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: "7d" });
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const session = await sessionModel.create({
        user: userId,
        refreshTokenHash,
        ip,
        userAgent,
    });

    const accessToken = jwt.sign(
        { id: userId, sessionID: session._id },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    );

    return { accessToken, refreshToken };
};

export const destroySessionByToken = async (userId, plainRefreshToken) => {
    const userSessions = await sessionModel.find({ user: userId });
    for (const session of userSessions) {
        const isMatch = await bcrypt.compare(plainRefreshToken, session.refreshTokenHash);
        if (isMatch) {
            await sessionModel.findByIdAndDelete(session._id);
            return true;
        }
    }
    return false;
};