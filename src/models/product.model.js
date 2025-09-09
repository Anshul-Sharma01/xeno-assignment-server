import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";

class Product extends Model {}


Product.init({
    external_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references : {model : "tenants", key : "id"} 
    },  
    handle: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    body_html: DataTypes.TEXT,
    vendor: DataTypes.STRING,
    product_type: DataTypes.STRING,
    tags: DataTypes.STRING,
    published: { type: DataTypes.BOOLEAN, defaultValue: true },
    price: DataTypes.FLOAT, 
    sku: DataTypes.STRING,  
    inventory_qty: DataTypes.INTEGER,
    image_src: DataTypes.STRING,
    options: DataTypes.JSON,   
    raw_data: DataTypes.JSON     
  },{
    sequelize,
    modelName : "Product",
    tableName : "products",
    timestamps : true
  }
)

export default Product;