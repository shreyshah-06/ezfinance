const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user"); // Import the User model

const Category = sequelize.define("Category", {
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
});

Category.belongsTo(User, { foreignKey: "userId" });

Category.sync()
  .then(() => console.log("Category table created successfully"))
  .catch((err) => console.error("Error creating Category table:", err));
module.exports = Category;
