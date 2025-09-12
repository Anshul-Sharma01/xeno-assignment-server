import db from "../models/index.js";
import { Op, Sequelize } from "sequelize";


class DashboardController{
    static async getSummary(req, res){
        try{
            const { tenantId } = req.params;

            const totalCustomers = await db.Customer.count({ where : { tenantId } });
            const totalOrders = await db.Order.count({ where : { tenantId } });

            const totalRevenue = await db.Order.sum("total_price", {
                where : { tenantId }
            });
            console.log(`Total Revenue : ${totalRevenue}, Total Orders : ${totalOrders}, Total Customers : ${totalCustomers}`);

            res.status(200).json({
                success : true,
                message : "Successfully fetched the numbers !!",
                totalCustomers,
                totalOrders,
                totalRevenue : totalRevenue || 0
            });
        }catch(err){
            console.error("Summary error : ", err);
            res.status(500).json({
                success : false,
                error : "Failed to fetch summary"
            })
        }
    }

    static async getOrdersByDate(req, res){
        try{
            const { tenantId } = req.params;
            const { start, end } = req.query;

            const where = { tenantId };
            if(start && end){
                const startDate = new Date(start);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(end);
                endDate.setHours(23, 59, 59, 999);
                where.created_at = {
                    [Op.between] : [startDate, endDate]
                };
            }
            const orders = await db.Order.findAll({
                where,
                attributes : [
                    [Sequelize.fn("DATE", Sequelize.col("created_at")), "date"],
                    [Sequelize.fn("COUNT", Sequelize.col("order_id")), "orderCount"],
                    [Sequelize.fn("SUM", Sequelize.col("total_price")), "revenue"],
                ],
                group : ["date"],
                order : [["date", "ASC"]]
            });

            res.status(200).json({
                success : true,
                message : "Successfully fetched orders by date",
                orders : orders
            });

        }catch(err){
            console.error(`Orders by date error : ${err}`);
            res.status(500)
            .json({
                success : false,
                error : "Failed to fetch orders by date !!"
            })
        }
    }

    static async getTopCustomers(req, res){
        try{
            const { tenantId } = req.params;

            const allOrders = await db.Order.findAll({
                where : { tenantId },
                attributes : ["order_id", "customer_id", "total_price"],
                limit : 5
            });
            console.log("Sample orders for tenant:", JSON.stringify(allOrders, null, 2));

            const topCustomers = await db.Order.findAll({
                where : { tenantId },
                attributes : [
                    "customer_id",
                    [Sequelize.fn("SUM", Sequelize.col("total_price")), "totalSpend"]
                ],
                group : ["customer_id"],
                order : [[Sequelize.literal("SUM(total_price)"), "DESC"]],
                limit : 5,
                raw: true
            });

            // Fetch customer names for each customer_id
            const customerIds = topCustomers?.map(customer => customer.customer_id).filter(id => id);
            const customers = await db.Customer.findAll({
                where : { 
                    tenantId,
                    external_id: customerIds 
                },
                attributes : ["external_id", "first_name", "last_name", "email"]
            });

            const customerMap = {};
            customers.forEach(customer => {
                const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 
                                   customer.email || 
                                   'Guest Customer';
                customerMap[customer.external_id] = customerName;
            });

            const formattedTopCustomers = topCustomers.map(customer => ({
                customer_id: customer.customer_id,
                customer_name: customer.customer_id ? 
                    (customerMap[customer.customer_id] || 'Guest Customer') : 
                    'Guest Customer',
                totalSpend: customer.totalSpend
            }));

            console.log("Formatted customers : ", formattedTopCustomers);

            res.status(200)
            .json({
                success : true,
                message : "Successfully fetched the top customers !!",
                topCustomers : formattedTopCustomers
            })
        }catch(err){
            console.error(`Top Customers error : ${err}`);
            res.status(500)
            .json({
                success : false,
                error : "Failed to fetch top customers"
            })
        }
    }


    static async getAverageOrderValue(req, res){
        try{
            const {tenantId } = req.params;
            const totalOrders = await db.Order.count({ where : { tenantId } });
            const totalRevenue = await db.Order.sum("total_price", { where : { tenantId } });

            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            res.status(200)
            .json({
                success : true,
                message : "Successfully fetched the average order valuee !!",
                AOV : averageOrderValue
            })
        }catch(err){
            res.status(500)
            .json({
                success : false,
                error : err.message
            })
        }
    }


    static async getAbandonedCheckouts(req, res){
        try{
            const { tenantId } = req.params;

            const where = { tenantId, status: "abandoned" };
            const count = await db.Checkout.count({ where });
            const recent = await db.Checkout.findAll({
                where,
                attributes: ["external_id", "customer_id", "subtotal_price", "createdAt"],
                order: [["createdAt", "DESC"]],
                limit: 10,
                raw: true
            });

            res.status(200)
            .json({
                success: true,
                message: "Successfully fetched abandoned checkouts",
                count,
                recent
            })
        }catch(err){
            console.error("Abandoned checkouts error : ", err);
            res.status(500)
            .json({
                success: false,
                error: "Failed to fetch abandoned checkouts"
            })
        }
    }
}


export default DashboardController;