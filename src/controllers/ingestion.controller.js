import db from "../models/index.js";
import ShopifySyncService from "../services/shopifysync.service.js";

const shopifySyncObject = new ShopifySyncService();


class IngestionController{
    static async syncTenantData(req, res){
        try{
            const { tenantId } = req.params;
            const tenant = await db.Tenant.findByPk(tenantId);

            if(!tenant){
                return res.status(404)
                .json({
                    success : false,
                    error : "Tenant does not exists !!"
                });
            }
            
            await shopifySyncObject.syncTenantData(tenant);
            return res.status(200)
            .json({
                success : true,
                message : "Tenant data synced successfully"
            });
        }catch(error){
            console.error(`Sync failed : ${error}`);
            res.status(500)
            .json({
                success : false,
                error : "Failed to sync tenant data"
            })
        }
    }
}

export default IngestionController;