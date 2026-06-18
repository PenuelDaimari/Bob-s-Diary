import transporter from "../config/transporter.js";
import config from "../config/config.js";

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: config.GOOGLE_USER,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Could not send email");
    }
};