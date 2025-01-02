const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expenseId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  vendorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expenseName:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Define associations
Expense.belongsTo(User, { foreignKey: "userId" });
// Invoice.hasMany(Sale, { foreignKey: 'invoiceNumber', onDelete: 'CASCADE' });
Expense.sync()
  .then(() => console.log("Expense table created successfully"))
  .catch((err) => console.error("Error creating Expense table:", err));
module.exports = Expense;
