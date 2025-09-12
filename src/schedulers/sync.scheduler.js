import cron from "node-cron";
import db from "../models/index.js";
import ShopifySyncService from "../services/shopifysync.service.js";

class SyncSchedulerService{
    constructor(){
        this.shopifySyncService = new ShopifySyncService();
    }

    async runSyncScheduler(){
        try{
            const tenants = await db.Tenant.findAll();
            console.log(`Found ${tenants.length} tenants to sync`);
            
            for(const tenant of tenants){
                console.log(`Syncing data for tenant : ${tenant.name}`);
                await this.shopifySyncService.syncTenantData(tenant);
            }
        }catch(err){
            console.error(`Error occurred while running cron jobs : ${err?.message}`);
            console.error(`Full error:`, err);
        }
    }

    start(){
        cron.schedule("*/30 * * * *", async() => {
            console.log("Running cron jobs !!");
            await this.runSyncScheduler();
        })

    }
}

export default SyncSchedulerService;