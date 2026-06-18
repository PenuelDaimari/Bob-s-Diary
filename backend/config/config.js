import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "MONGO_URI", "JWT_SECRET", "GOOGLE_REFRESH_TOKEN", 
    "GOOGLE_USER", "CLIENT_ID", "CLIENT_SECRET", "PORT","FRONTEND_URL"
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} is not defined in environment variables`);
    }
});

const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER,
    FRONTEND_URL:process.env.FRONTEND_URL,
};

export default config;