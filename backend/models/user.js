const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const User = db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    State: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "User",
  }
);

User.sync()
  .then(() => console.log("User table created successfully"))
  .catch((err) => console.error("Error creating User table:", err));

module.exports = User;
