import Product from "./product.model.js";
import Customer from "./customer.model.js";
import Order from "./order.model.js";
import Tenant from "./Tenant.model.js";
import sequelize from "../config/db.config.js";

const db = {
    Product,
    Customer,
    Order,
    Tenant
};


export default db;

