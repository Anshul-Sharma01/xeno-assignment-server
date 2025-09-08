import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";

class Order extends Model {}

Order.init({
    order_id : { type : DataTypes.STRING, unique : true },
    customer_id: { type: DataTypes.STRING },
    email: DataTypes.STRING,
    total_price: DataTypes.FLOAT,
    subtotal_price: DataTypes.FLOAT,
    total_tax: DataTypes.FLOAT,
    total_discounts: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    financial_status: DataTypes.STRING,
    fulfillment_status: DataTypes.STRING,
    line_items: DataTypes.JSON,
    shipping_address: DataTypes.JSON,
    billing_address: DataTypes.JSON,
    tags: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    raw_data: DataTypes.JSON ,
    tenantId : {
        type : DataTypes.UUID,
        allowNull : false,
        references : { model : "tenants", key : "id"}
    } 
}, {
    sequelize : "Order",
    tableName : "orders",
    timestamps : false
})

export default Order;