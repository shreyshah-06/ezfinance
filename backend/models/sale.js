const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // Import the User model
const Product = require("./product"); // Import the Product model

const Sale = sequelize.define("Sale", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  invoiceNumber:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discountPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  total:{
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

// Define associations
Sale.belongsTo(User, { foreignKey: "userId" });
Sale.belongsTo(Product, { foreignKey: "productId" });

Sale.sync()
  .then(() => console.log("Sale table created successfully"))
  .catch((err) => console.error("Error creating Sale table:", err));
module.exports = Sale;
