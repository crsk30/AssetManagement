const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("kttest", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
});

const Employee = sequelize.define("employee", {
  employee_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  emp_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address_1: Sequelize.STRING,
  address_2: Sequelize.STRING,
  city: Sequelize.STRING,
  pincode: Sequelize.INTEGER,
  designation: Sequelize.STRING,
  date_of_hire: Sequelize.DATE,
  employee_is_active: Sequelize.BOOLEAN,
  emp_branch_id: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

const AssetCategory = sequelize.define("asset_categories", {
  asset_catID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  asset_is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

const Asset = sequelize.define("assets", {
  asset_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asset_catID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: AssetCategory,
      key: "asset_catID",
    },
  },
  make: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  serial_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  asset_is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  asset_is_scrap: Sequelize.BOOLEAN,
  asset_branch_id: Sequelize.INTEGER,
});

const AssetTransaction = sequelize.define("asset_transactions", {
  asset_transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  emp_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  asset_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asset_category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  asset_status: {
    type: DataTypes.ENUM("issued", "repair", "returned"),
    allowNull: false,
  },
});

(async () => {
  await sequelize.sync();
  console.log("Database synced");
})();

module.exports = {
  sequelize,
  Employee,
  AssetCategory,
  Asset,
  AssetTransaction,
};
