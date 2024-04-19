const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Customer = sequelize.define("Customer", {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, 
    validate: {
      isEmail: true, 
    },
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  previousCreditBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

Customer.belongsTo(User, { foreignKey: "userId" });
Customer.sync()
  .then(() => console.log("Customer table created successfully"))
  .catch((err) => console.error("Error creating Customer table:", err));
module.exports = Customer;
