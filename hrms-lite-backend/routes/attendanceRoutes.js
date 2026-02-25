const express = require("express");
const { AttendanceModel } = require("../model/attendanceModel");
const { EmployeeModel } = require("../model/employeeModel");
const { authMiddleware } = require("../middleware/authMiddleware");

const AttendanceRouter = express.Router();

// All attendance routes require authentication
AttendanceRouter.use(authMiddleware);

// POST /api/attendance / Mark attendance for an employee 
AttendanceRouter.post("/", async (req, res) => {
  const { employeeId, date, status } = req.body;

  // validation
  if (!employeeId || !date || !status) {
    return res.status(400).json({
      success: false,
      msg: "All fields are required: employeeId, date, status",
    });
  }

  // Status validation
  if (!["Present", "Absent"].includes(status)) {
    return res.status(400).json({
      success: false,
      msg: "Status must be 'Present' or 'Absent'",
    });
  }

  // Date format validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({
      success: false,
      msg: "Date must be in YYYY-MM-DD format",
    });
  }

  try {
    // Verify employee exists
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }

    // Check if attendance already marked for this date
    const existing = await AttendanceModel.findOne({
      employee: employeeId,
      date,
    });

    if (existing) {
      // Update existing record
      existing.status = status;
      await existing.save();
      const populated = await existing.populate("employee", "fullName employeeId department");
      return res.status(200).json({
        success: true,
        data: { msg: "Attendance updated", attendance: populated },
      });
    }

    const attendance = new AttendanceModel({
      employee: employeeId,
      date,
      status,
    });
    await attendance.save();
    const populated = await attendance.populate("employee", "fullName employeeId department");

    res.status(201).json({
      success: true,
      data: { msg: "Attendance marked successfully", attendance: populated },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

// GET /api/attendance / Get all attendance records (filter)
AttendanceRouter.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) {
      filter.date = req.query.date;
    }

    const records = await AttendanceModel.find(filter)
      .populate("employee", "fullName employeeId department email")
      .sort({ date: -1, markedAt: -1 });

    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
// GET /api/attendance/employee/:employeeId / Get attendance for one employee
AttendanceRouter.get("/employee/:employeeId", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, msg: "Employee not found" });
    }

    const filter = { employee: req.params.employeeId };
    if (req.query.date) {
      filter.date = req.query.date;
    }

    const records = await AttendanceModel.find(filter).sort({ date: -1 });

    // total present days count
    const totalPresent = records.filter((r) => r.status === "Present").length;

    res.status(200).json({
      success: true,
      data: {
        employee,
        totalDays: records.length,
        totalPresent,
        totalAbsent: records.length - totalPresent,
        records,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});
// DELETE /api/attendance/:id / Delete a single attendance record
AttendanceRouter.delete("/:id", async (req, res) => {
  try {
    const record = await AttendanceModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, msg: "Attendance record not found" });
    }
    res
      .status(200)
      .json({ success: true, data: { msg: "Attendance record deleted" } });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = { AttendanceRouter };
