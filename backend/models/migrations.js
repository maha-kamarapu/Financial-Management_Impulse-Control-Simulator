const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./database");

const Achievement = sequelize.define("Achievement", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Achievement;

// Add Budget table
const Budget = sequelize.define("Budget", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalBudget: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  spent: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

// Add Goals table
const Goal = sequelize.define("Goal", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  goalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  savedAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Debt = sequelize.define("Debt", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Debt;

Budget.sync();
Goal.sync();

