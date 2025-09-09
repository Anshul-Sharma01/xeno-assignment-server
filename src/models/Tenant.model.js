import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";


class Tenant extends Model{}

Tenant.init({
    id : { 
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
        validate : { isEmail : true }
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    shopifyDomain : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    accessToken : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    refreshToken : {
        type : DataTypes.TEXT,
        allowNull : true
    }
}, {
    sequelize,
    modelName : "Tenant",
    tableName : "tenants",
    timestamps : false
})

export default Tenant;