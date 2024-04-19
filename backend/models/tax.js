// models/Tax.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Tax = sequelize.define("Tax", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Reference the User model
      key: "id", // Reference the id field in the User model
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
        min: 0, // Minimum value allowed for tax percentage
        max: 100, // Maximum value allowed for tax percentage
    },
  },
});
Tax.belongsTo(User, { foreignKey: "userId" });

Tax.sync()
  .then(() => console.log("Tax table created successfully"))
  .catch((err) => console.error("Error creating Tax table:", err));
module.exports = Tax;
