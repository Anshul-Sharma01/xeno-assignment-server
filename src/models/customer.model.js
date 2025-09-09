import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";

class Customer extends Model {}

Customer.init({
    external_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references : {model : "tenants", key : "id"} 
    }, 
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    accepts_email_marketing: { type: DataTypes.BOOLEAN, defaultValue: false },    default_address: DataTypes.JSON,
    tags: DataTypes.STRING,
    raw_data: DataTypes.JSON 
  }, {
    sequelize,
    modelName : "Customer",
    tableName : "customers",
    timestamps : true
});

export default Customer;