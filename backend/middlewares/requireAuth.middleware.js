import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";


export const requireAuth = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Authentication required. Please log in"
            })
        }

        const accessToken = authHeader.split(" ")[1];
        
        const decoded = jwt.verify(accessToken,config.JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                message:"User no longer exists."
            })
        }

        req.user = user;

        next()
    }
    catch(error){
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                message:"Access Token Expired",
                code: "TOKEN_EXPIRED"
            })
        }
        return res.status(401).json({
            message:"Invalid or expired token."
        })
    }
}