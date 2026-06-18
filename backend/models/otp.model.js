import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['REGISTRATION', 'RESET_PASSWORD'],
        required: true,
    },
    username: {
        type: String,
    },
    password: { 
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    }
});

export default mongoose.model("otps", otpSchema);