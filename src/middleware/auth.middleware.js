import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const authenticateTenant = (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader && authHeader.split(' ')[1];
        const cookieToken = req.cookies && req.cookies.accessToken;
        const token = bearerToken || cookieToken;
        
        if(!token){
            return next(new ApiError(401, "Access Token Missing"));
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tenant) => {
            if(err) return next(new ApiError(403, "Invalid or expired token"));
            req.tenant = tenant;

            next();
        })
    }catch(err){
        next(new ApiError(500, "Authentication failure"));
    }
}