const express = require("express");
const { EmployeeModel } = require("../model/employeeModel");
const { AttendanceModel } = require("../model/attendanceModel");
const { authMiddleware } = require("../middleware/authMiddleware");

const DashboardRouter = express.Router();

// All dashboard routes require authentication
DashboardRouter.use(authMiddleware);

// GET /api/dashboard 
DashboardRouter.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const [
      totalEmployees,
      totalPresentToday,
      totalAbsentToday,
      departmentCounts,
      recentEmployees,
    ] = await Promise.all([
      // Total employees
      EmployeeModel.countDocuments(),

      // Today's present count
      AttendanceModel.countDocuments({ date: today, status: "Present" }),

      // Today's absent count
      AttendanceModel.countDocuments({ date: today, status: "Absent" }),

      // Employees grouped by department
      EmployeeModel.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $project: { department: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Last 5 added employees
      EmployeeModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("employeeId fullName department email createdAt"),
    ]);

    // Total attendance marked today
    const totalMarkedToday = totalPresentToday + totalAbsentToday;
    const notMarkedToday = totalEmployees - totalMarkedToday;

    res.status(200).json({
      success: true,
      data: {
        today,
        totalEmployees,
        attendance: {
          totalMarkedToday,
          totalPresentToday,
          totalAbsentToday,
          notMarkedToday,
        },
        departmentCounts,
        recentEmployees,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
});

module.exports = { DashboardRouter };
