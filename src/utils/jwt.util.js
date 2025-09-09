import jwt from "jsonwebtoken";

export const generateAccessToken = (tenant) => {
    return jwt.sign(
        { id: tenant.id, email: tenant.email, shopifyDomain: tenant.shopifyDomain },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m' }
    );
};

export const generateRefreshToken = (tenant) => {
    return jwt.sign(
        { id: tenant.id, email: tenant.email, shopifyDomain: tenant.shopifyDomain },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};
