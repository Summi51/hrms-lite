const express = require("express");
const { EmployeeModel } = require("../model/employeeModel");
const { AttendanceModel } = require("../model/attendanceModel");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

const EmployeeRouter = express.Router();

// All employee routes require authentication
EmployeeRouter.use(authMiddleware);

// POST /api/employees / Add a new employee (admin/hr only)
EmployeeRouter.post("/", roleMiddleware("admin", "hr"), async (req, res) => {
  const { employeeId, fullName, email, department } = req.body;

  // Required-field validation
  if (!employeeId || !fullName || !email || !department) {
    return res.status(400).json({
      success: false,
      msg: "All fields are required: employeeId, fullName, email, department",
    });
  }

  // Email format validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, msg: "Invalid email format" });
  }

  try {
    // Duplicate check
    const existingById = await EmployeeModel.findOne({ employeeId });
    if (existingById) {
      return res
        .status(409)
        .json({ success: false, msg: "Employee ID already exists" });
    }

    const existingByEmail = await EmployeeModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingByEmail) {
      return res
        .status(409)
        .json({ success: false, msg: "Email already registered" });
    }

    const employee = new EmployeeModel({ employeeId, fullName, email, department });
    await employee.save();

    res.status(201).json({
      success: true,
      data: { msg: "Employee added successfully", employee },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// GET /api/employees / Get all employees 
EmployeeRouter.get("/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// GET /api/employees/:id / Get single employee 
EmployeeRouter.get("/:id", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// DELETE /api/employees/:id / Delete an employee (admin/hr only)
EmployeeRouter.delete("/:id", roleMiddleware("admin", "hr"), async (req, res) => {
  try {
    const employee = await EmployeeModel.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }

    // Also remove all attendance records linked to this employee
    await AttendanceModel.deleteMany({ employee: req.params.id });

    res.status(200).json({
      success: true,
      data: { msg: "Employee and related attendance records deleted" },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = { EmployeeRouter };
