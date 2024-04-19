// models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Category = require("./category");
const Supplier = require("./supplier");
const Tax = require("./tax");

const Product = sequelize.define("Product", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
  sellingPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  taxId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tax,
      key: "id",
    },
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Supplier,
      key: "id",
    },
  },
  purchasePrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Product.belongsTo(User, { foreignKey: "userId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });
Product.belongsTo(Supplier, { foreignKey: "supplierId" });
Product.belongsTo(Tax, { foreignKey: "taxId" });

Product.sync()
  .then(() => console.log("Product table created successfully"))
  .catch((err) => console.error("Error creating Product table:", err));
module.exports = Product;
