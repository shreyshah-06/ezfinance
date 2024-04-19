const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Supplier = sequelize.define("Supplier", {
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

Supplier.belongsTo(User, { foreignKey: "userId" });

Supplier.sync()
  .then(() => console.log("Supplier table created successfully"))
  .catch((err) => console.error("Error creating Supplier table:", err));
module.exports = Supplier;
