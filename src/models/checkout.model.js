import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.config.js";

class Checkout extends Model {}

Checkout.init(
  {
    external_id: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    }, 

    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "tenants", key: "id" },
    },

    customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    line_items: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    subtotal_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("started", "abandoned"),
      allowNull: false,
    },

    raw_data: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Checkout",
    tableName: "checkouts",
    timestamps: true, 
  }
);

export default Checkout;
