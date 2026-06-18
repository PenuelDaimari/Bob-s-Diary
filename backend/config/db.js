import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected");
    }
    catch(error){
        console.log(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;