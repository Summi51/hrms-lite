const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: [true, "Employee reference is required"],
    },
    date: {
      type: String, // stored as "YYYY-MM-DD" for easy querying / filtering
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Present", "Absent"],
        message: "Status must be Present or Absent",
      },
      required: [true, "Status is required"],
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Prevent duplicate attendance record for same employee on same date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const AttendanceModel = mongoose.model("attendance", attendanceSchema);

module.exports = { AttendanceModel };
