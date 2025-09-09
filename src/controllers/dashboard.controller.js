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
                where.created_at = {
                    [Op.between] : [new Date(start), new Date(end)]
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

            const topCustomers = await db.Order.findAll({
                where : { tenantId },
                attributes : [
                    "customer_id",
                    [Sequelize.fn("SUM", Sequelize.col("total_price")), "totalSpend"]
                ],
                group : ["customer_id"],
                order : [[Sequelize.literal("totalSpend"), "DESC"]],
                limit : 5
            });

            res.status(200)
            .json({
                success : true,
                message : "Successfully fetched the top customers !!",
                topCustomers : topCustomers
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
}


export default DashboardController;