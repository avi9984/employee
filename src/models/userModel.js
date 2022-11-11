const mongoose = require("mongoose");
// First Name, Last Name, Email ID, Password, a unique employeeID and Organization Name
const userSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true, trim: true },
    lName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    orgName: { type: String, required: true },
    employeeId: { type: Number, unique: true, required: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee-Reg", userSchema);
