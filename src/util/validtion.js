const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return true;
  if (typeof value === "string" && value.trim().length === 0) return true;
  return false;
};

const isValidObjectType = (value) => {
  if (typeof value === "object" && Object.keys(value).length > 0) {
    return false;
  } else {
    return true;
  }
};

const isValidBody = (object) => {
  if (Object.keys(object).length > 0) {
    return false;
  } else {
    return true;
  }
};

const validString = (String) => {
  if (/\d/.test(String)) {
    return true;
  } else {
    return false;
  }
};



const validEmail = (Email) => {
  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)) {
    return false;
  } else {
    return true;
  }
};

const validPwd = (Password) => {
  if (
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
      Password
    )
  ) {
    return false;
  } else {
    return true;
  }
};

const validEmpId = (employeeId) => {
  if (/^[1-9]\d{4}$/.test(employeeId)) {
    return true;
  } else {
    return true;
  }
};
const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};



module.exports = {isValid,isValidObjectType,isValidBody,validString,validEmail,validPwd,isValidObjectId,validEmpId};
