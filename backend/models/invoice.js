// models/Invoice.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // Import the User model
const Sale = require("./sale"); // Import the Sale model

const Invoice = sequelize.define("Invoice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoiceNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalTax:{
    type: DataTypes.FLOAT,
    default: null
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  profit:{
    type: DataTypes.FLOAT,
    default: null
  }
});

// Define associations
Invoice.belongsTo(User, { foreignKey: "userId" });
Invoice.hasMany(Sale, { foreignKey: 'invoiceNumber', onDelete: 'CASCADE' });
Invoice.sync()
  .then(() => console.log("Invoice table created successfully"))
  .catch((err) => console.error("Error creating Invoice table:", err));
module.exports = Invoice;
