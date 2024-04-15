const express = require("express");
const app = express();
const path = require("path");
const {
  sequelize,
  Employee,
  AssetCategory,
  Asset,
  AssetTransaction,
} = require("./models/sequelize");

app.set("view engine", "jade");

app.set("views", path.join(__dirname, "./views"));

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index.jade", { title: "Assest Management Tool" });
});

app.get("/add-employee", (req, res) => {
  res.render("add-employee.jade", { title: "Add Employee" });
});

app.get("/view-employee", (req, res) => {
  res.render("view-employee.jade", { title: "View an Employee" });
});

app.get("/list-employee", (req, res) => {
  res.render("list-employee.jade", { title: "List of Employees" });
});

app.get("/add-asset", (req, res) => {
  res.render("add-asset.jade", { title: "Add an asset" });
});

app.get("/list-asset", (req, res) => {
  res.render("list-asset.jade", { title: "List of assets" });
});

app.get("/view-asset", (req, res) => {
  res.render("view-asset.jade", { title: "Asset Details" });
});

app.get("/asset-entry", (req, res) => {
  res.render("issue-asset.jade", { title: "Entry and Return Entry" });
});

app.get("/asset-history", (req, res) => {
  res.render("asset-history.jade", { title: "Asset History" });
});

app.get("/api/employees", async (req, res) => {
  try {
    const allEmployees = await Employee.findAll();
    console.log("ALl ", allEmployees);
    res.json(allEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    const {
      emp_name,
      address_1,
      address_2,
      city,
      pincode,
      designation,
      date_of_hire,
      employee_is_active,
      emp_branch_id,
    } = req.body;

    const newEmployee = await Employee.create({
      emp_name,
      address_1,
      address_2,
      city,
      pincode,
      designation,
      date_of_hire,
      employee_is_active,
      emp_branch_id,
    });

    res.status(201).json({ msg: "Data added successfully" });
  } catch (error) {
    console.error("Error inserting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const {
      emp_name,
      address_1,
      address_2,
      city,
      pincode,
      designation,
      date_of_hire,
      employee_is_active,
      emp_branch_id,
    } = req.body;
    await employee.update({
      emp_name,
      address_1,
      address_2,
      city,
      pincode,
      designation,
      date_of_hire,
      employee_is_active,
      emp_branch_id,
    });

    res.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/assets", async (req, res) => {
  try {
    const {
      asset_name,
      asset_catID,
      make,
      model,
      year,
      serial_no,
      asset_is_active,
      asset_branch_id,
    } = req.body;

    const category = await AssetCategory.findByPk(asset_catID);
    if (!category) {
      return res.status(404).json({ error: "Asset category not found" });
    }

    const newAsset = await Asset.create({
      asset_name,
      asset_catID,
      make,
      model,
      year,
      serial_no,
      asset_is_active,
      asset_branch_id,
    });

    res.status(201).json({ msg: "Data added successfully" });
  } catch (error) {
    console.error("Error creating asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      asset_name,
      asset_catID,
      make,
      model,
      year,
      serial_no,
      asset_is_active,
      asset_branch_id,
    } = req.body;

    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    if (asset_catID) {
      const category = await AssetCategory.findByPk(asset_catID);
      if (!category) {
        return res.status(404).json({ error: "Asset category not found" });
      }
    }

    await asset.update({
      asset_name,
      asset_catID,
      make,
      model,
      year,
      serial_no,
      asset_is_active,
      asset_branch_id,
    });

    res.json(asset);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/assets", async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: {
        asset_is_scrap: false,
      },
    });
    res.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/asset", async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/asset_categories", async (req, res) => {
  try {
    const { asset_category, asset_is_active } = req.body;
    console.log("ASset :", req.body);
    const newAssetCategory = await AssetCategory.create({
      asset_category,
      asset_is_active,
    });

    res.status(201).json(newAssetCategory);
  } catch (error) {
    console.error("Error creating asset category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// const { Op } = require('sequelize');

app.get("/api/asset/active", async (req, res) => {
  try {
    const activeAssetsByBranch = await Asset.findAll({
      attributes: [
        "asset_branch_id",
        "asset_name",
        [sequelize.fn("COUNT", sequelize.col("*")), "total_active_assets"],
      ],
      where: {
        asset_is_active: true,
        asset_is_scrap: false,
      },
      group: ["asset_branch_id", "asset_name"],
      raw: true,
    });

    const overallActiveAssets = await Asset.count({
      where: {
        asset_is_active: true,
        asset_is_scrap: false,
      },
    });

    res.json({
      activeAssetsByBranch,
      overallActiveAssets,
    });
  } catch (error) {
    console.error("Error fetching active assets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/asset_transactions", async (req, res) => {
  try {
    const {
      asset_id,
      emp_id,
      asset_name,
      asset_category,
      transaction_date,
      notes,
      asset_status,
    } = req.body;

    const newTransaction = await AssetTransaction.create({
      asset_id,
      emp_id,
      asset_name,
      asset_category,
      transaction_date,
      notes,
      asset_status,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error inserting data into asset transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/asset/:id", async (req, res) => {
  const assetId = req.params.id;
  try {
    const asset = await Asset.findByPk(assetId);

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    const { asset_is_scrap } = req.body;
    await asset.update({ asset_is_scrap });

    res.json(asset);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/asset-transactions", async (req, res) => {
  try {
    const assetTransactions = await AssetTransaction.findAll();

    res.json(assetTransactions);
  } catch (error) {
    console.error("Error retrieving asset transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/employee/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Asset.hasMany(AssetTransaction, { foreignKey: "asset_id" });
AssetTransaction.belongsTo(Asset, { foreignKey: "asset_id" });
app.get("/asset-report/:assetId", async (req, res) => {
  const assetId = req.params.assetId;

  try {
    const assetReport = await Asset.findOne({
      where: { asset_id: assetId },
      include: [
        {
          model: AssetTransaction,
          required: true,
        },
      ],
    });

    if (!assetReport) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.json(assetReport);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
