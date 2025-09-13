import cron from "node-cron";
import db from "../models/index.js";
import ShopifySyncService from "../services/shopifysync.service.js";

class SyncSchedulerService{
    constructor(io){
        this.shopifySyncService = new ShopifySyncService();
        this.io = io;
    }

    async runSyncScheduler(){
        try{
            const tenants = await db.Tenant.findAll();
            console.log(`Found ${tenants.length} tenants to sync`);
            
            for(const tenant of tenants){
                console.log(`Syncing data for tenant : ${tenant.name}`);
                await this.shopifySyncService.syncTenantData(tenant);

                this.io.emit("tenantSyncComplete",{
                    tenantId : tenant.id,
                    timestamp : new Date()
                });
            }

            this.io.emit("syncComplete", {
                message : "All tenants synced successfully",
                timestamp : new Date()
            })
        }catch(err){
            console.error(`Error occurred while running cron jobs : ${err?.message}`);
            console.error(`Full error:`, err);

            this.io.emit("syncError", {
                message : err?.message || "Sync Error",
                timestamp : new Date()
            })
        }
    }

    start(){
        cron.schedule(`*/${process.env.SCHEDULER_SYNC_TIME} * * * *`, async() => {
            console.log("Running cron jobs !!");
            await this.runSyncScheduler();
        })

    }
}

export default SyncSchedulerService;