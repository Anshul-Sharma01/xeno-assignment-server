import Tenant from "../models/Tenant.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export default class TenantService{
    async createTenant({ name, email, password, shopifyDomain, accessToken }){
        const tenantExists = await Tenant.findOne({ where : { email } });
        if(tenantExists){
            throw new ApiError(400, "Tenant already exists !!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const tenant = await Tenant.create({
            name, email, password : hashedPassword,
            shopifyDomain, accessToken
        });
        
        const jwtAccessToken = generateAccessToken(tenant);
        const jwtRefreshToken = generateRefreshToken(tenant);

        tenant.refreshToken = jwtRefreshToken;
        await tenant.save();

        return { accessToken : jwtAccessToken, refreshToken : jwtRefreshToken, tenantId : tenant?.id };

    }

    async loginTenant({email, password}){
        const tenant = await Tenant.findOne({ where : { email } });
        if(!tenant){
            throw new ApiError(404, "Tenant not found !!");
        }

        const validPassword = await bcrypt.compare(password, tenant.password);
        if(!validPassword){
            throw new ApiError(400, "Invalid credentials !! ");
        }

        const jwtAccessToken = generateAccessToken(tenant);
        const jwtRefreshToken = generateRefreshToken(tenant);

        tenant.refreshToken = jwtRefreshToken;
        await tenant.save();
        return { accessToken : jwtAccessToken, refreshToken : jwtRefreshToken, tenantId : tenant?.id };
    }

    async refreshTenantToken(refreshToken){
        if(!refreshToken){
            throw new ApiError(400, "Refresh token missing !!");
        }

        let payload;
        try{
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }catch(err){
            throw new ApiError(403, "Invalid refresh Token");
        }

        const tenant = await Tenant.findByPk(payload.id);
        if(!tenant || tenant.refreshToken !== refreshToken){
            throw new ApiError(403, "Invalid refresh Token");
        }

        const newAccessToken = generateAccessToken(tenant);
        const newRefreshToken = generateRefreshToken(tenant);
        tenant.refreshToken = newRefreshToken;
        await tenant.save();

        return { accessToken : newAccessToken, refreshToken : newRefreshToken, tenantId : tenant?.id };
    }

    async logoutTenant(refreshToken){
        const tenant = await Tenant.findOne({ where : { refreshToken } });
        if(tenant){
            tenant.refreshToken = null;
            await tenant.save();
        }
    }
    async getAllTenants(){
        return await Tenant.findAll();
    }

    async getTenantById(id){
        const tenant = await Tenant.findByPk(id);
        if(!tenant){
            throw new ApiError(404, "Tenant not found !!");
        }
        return tenant;
    }
}
