import { sendEmail } from "../utils/sendEmail.util.js";
import { getOtpEmailTemplate, getPasswordResetTemplate } from "../templates/email.template.js";
import { generateOTP } from "../utils/otp.util.js";
import otpModel from "../models/otp.model.js";

export const sendRegistrationOtpService = async (username, email, hashedPassword) => {
    const otp = generateOTP(6);

    await otpModel.findOneAndDelete({ email, type: 'REGISTRATION' }); 
    await otpModel.create({ 
        username, 
        email, 
        password: hashedPassword, 
        otp, 
        type: 'REGISTRATION' 
    });

    const htmlTemplate = getOtpEmailTemplate(otp);
    await sendEmail(email, "Verify Your Registration", htmlTemplate);

    return true;
};

export const verifyRegistrationOtpService = async (email, providedOtp) => {
    const pendingUser = await otpModel.findOne({ email, otp: providedOtp, type: 'REGISTRATION' });
    if (!pendingUser) return null;
    
    await otpModel.findByIdAndDelete(pendingUser._id);
    return pendingUser;
};


export const sendPasswordResetOtpService = async (email) => {
    const otp = generateOTP(6);

    await otpModel.findOneAndDelete({ email, type: 'RESET_PASSWORD' }); 
    await otpModel.create({ 
        email, 
        otp, 
        type: 'RESET_PASSWORD' 
    });

    const htmlTemplate = getPasswordResetTemplate(otp);
    await sendEmail(email, "Password Reset Authorization Code", htmlTemplate);

    return true;
};

export const verifyPasswordResetOtpService = async (email, providedOtp) => {
    const record = await otpModel.findOne({ email, otp: providedOtp, type: 'RESET_PASSWORD' });
    if (!record) return false;
    
    await otpModel.findByIdAndDelete(record._id);
    return true;
};