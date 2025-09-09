import TenantService from "../services/tenant.service.js";

const tenantService = new TenantService();

export default class TenantController{

    static cookieOptions = {
        secure : process.env.NODE_ENV === "production",
        maxAge : 60 * 60 * 10000,
        httpOnly : true,
    }

    static async register(req, res){
        try{
            const tokens = await tenantService.createTenant(req.body);

            res.cookie('accessToken', tokens.accessToken, TenantController.cookieOptions);
            res.cookie('refreshToken', tokens.refreshToken, TenantController.cookieOptions);

            return res.status(201)
            .json({ 
                success : true,
                message : "Successfully onboarded the tenant !!",
                tokens
            });
        }catch(err){
            return res.status(500)
            .json({
                success : false,
                error : err.message
            })
        }
    }
    
    static async login(req, res){
        try{
            const tokens = await tenantService.loginTenant(req.body);

            res.cookie('accessToken', tokens.accessToken, TenantController.cookieOptions);
            res.cookie('refreshToken', tokens.refreshToken,TenantController.cookieOptions);

            return res.status(200)
            .json({ 
                success : true,
                message : "Successfully Logged In the tenant !!",
                tokens
            });

        }catch(err){
            res.status(500)
            .json({
                success : false,
                error : err.message
            })
        }
    }
    
    static async refreshToken(req, res){
        try{
            const refreshToken = req.cookies && req.cookies.refreshToken;
            const tokens = await tenantService.refreshTenantToken(refreshToken);


            res.cookie('accessToken', tokens.accessToken, TenantController.cookieOptions);
            res.cookie('refreshToken', tokens.refreshToken, TenantController.cookieOptions);

            return res.status(200)
            .json({ 
                success : true,
                message : "Successfully Refresh the tenant Refresh Token!!",
                tokens
            });
        }catch(err){
            res.status(500)
            .json({
                success : false,
                error : err.message
            })
        }
    }
    
    static async logout(req, res){
        try{
            const refreshToken = req.cookies && req.cookies.refreshToken;
            await tenantService.logoutTenant(refreshToken);
            res.clearCookie('accessToken', TenantController.cookieOptions);
            res.clearCookie('refreshToken', TenantController.cookieOptions);

            return res.status(200)
            .json({ 
                success : true,
                message : "Successfully Logged Out the tenant !!",
            });
        }catch(err){
            res.status(500)
            .json({
                success : false,
                error : err.message
            })
        }
    }
}