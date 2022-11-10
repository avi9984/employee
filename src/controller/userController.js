const User=require('../models/userModel')
const {isValid,isValidBody,validString,validEmail,validPwd,isValidObjectId}=require('../util/validtion')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

// ==========================employee registration================
const createEmployee=async (req,res)=>{
try {
  let data = req.body;
  if(isValidBody(data)){
    return res.status(400).json({status:false, msg:"datils is reqruied"})
  }
  var {fName,lName,email,orgName,employeeId,password}=data;
  if(!fName){
    return res.status(400).json({status:false, msg:"first name is requried"})
  }else if(validString(fName)){
    return res.status(400).json({status:false, msg:"fName should be valid and should not contains any numbers"})
  }

  if(!lName){
    return res.status(400).json({status:false, msg:"lName name is requried"})
  }else if(validString(lName)){
    return res.status(400).json({status:false, msg:"fName should be valid and should not contains any numbers"})
  }

  if(!orgName){
    return res.status(400).json({status:false, msg:"org name is requried"})
  }else if(validString(lName)){
    return res.status(400).json({status:false, msg:"org should be valid and should not contains any numbers"})
  }

  if(!employeeId){
    return res.status(400).json({status:false, msg:"employee id is requried"})
  }else if(!validString(employeeId)){
    return res.status(400).json({status:false, msg:"employee id use company first two letter then your id like Ur11"})
  }
  const checkEmployeeId=await User.findOne({employeeId:employeeId})
  if(!checkEmployeeId){
    return res.status(400).json({status:false, msg:"emp id is unique"})
  }  

  if(!password){
    return res.status(400).json({status:false, msg:"employee id is requried"})
  }else if(validPwd(password)){
    return res.status(400).json({status:false, msg:"Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters"})
  }

  if(!email){
    return res.status(400).json({status:false, msg:"email id is requried"})
  }else if(validEmail(email)){
    return res.status(400).json({status:false, msg:"email is not valid"})
  }

  const checkEmail=await User.findOne({email:email});
  if(checkEmail){
    return res.status(400).json({status:false, msg:"email is already exist"})
  }

  //Password Encryption

  data.password = await bcrypt.hash(data.password, 10);

  let userData = await User.create(data);

    res.status(201).send({status: true,message: "User created successfully",data: userData});
  
} catch (err) {
  res.status(500).send({ status: false, error: err.message });
}
};

   

// ========================login api======================

const empLogin = async (req, res)=> {
    try {
      let data = req.body;
  
      //Validate the body
  
      if (isValidBody(data)) {
        return res.status(400).send({ status: false, message: "Enter user details" });
      }
  
      //Check the email
  
      if (!data.email) {
        return res.status(400).send({ status: false, message: "Email ID is required" });
      }
  
      //check the password
  
      if (!data.password) {
        return res.status(400).send({ status: false, message: "Password is required" });
      }
  
      //Validate the email
  
      if (validEmail(data.email)) {
        return res.status(400).send({ status: false, message: "Enter a valid email-id" });
      }
  
      //Validate the password
  
      if (validPwd(data.password)) {
        return res.status(400).send({ status: false, message: "Enter a valid password" });
      }
  
      //Email check
  
      const checkValidUser = await User.findOne({ email: data.email });
  
      if (!checkValidUser) {
        return res.status(400).send({ status: false, message: "Email Id is not correct " });
      }
  
      //Password check
  
      let checkPassword = await bcrypt.compare(data.password,checkValidUser.password);
  
      if (!checkPassword) {
        return res.status(400).send({ status: false, message: "Password is not correct" });
      }
  
      // token generation for the logged in user
  
      let token = jwt.sign({ userId: checkValidUser._id }, "employee-reg", {
        expiresIn: "1d",
      });
  
      //set token to the header
  
      res.setHeader("x-api-key", token);
  
      res.status(200).send({ status: true, message: "Successfully Login", data: token });
    } catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };

  // ===============================Get All employee========================

  const getAllEmp=async (req,res)=>{

    try {
      const allEmp=await User.find();
      if(!allEmp){
          return res.status(400).json({status:false, msg:"invalid requrest"})
      }
      return res.status(200).json({status:true, msg:"All form is given", data:allEmp})

    } catch (error) {
      console.log(error)
      res.status(500).json({status:false, msg:"internal sever error"})
    }
  }

  // ===================================Get Employee By Id================

  const getEmpById=async (req,res)=>{
    try {
      const id = req.params.id;
        
          if(!mongoose.isValidObjectId(id)){
              return res.status(400).json({status:false, msg:"id is not found"})
          }
          const chechID=await User.findById(id)
         
          res.status(200).json({status:true, msg:"find employee by id ",data:chechID})
         
    } catch (error) {
       console.log(error)
       res.status(500).json({status:false, status:error})
    }
  }

  // ================================Update Employee =================

  const updateEmp=async (req,res)=>{
    try {
      let empId=req.params.empid;
      let checkEmpId=await User.findById(empId);
      if(!checkEmpId){
        return res.status(400).json({status:false, msg:"not found the employee"})
      }
      let data=req.body;
      let {fName,lName,email,password,orgName,empid}=data
      if(isValidBody(data)){
        return res.status(400).json({status:false, msg:"data is requried to anything to be updated"})
      }

      if(validString(fName)||validString(lName)||validString(orgName)){
        return res.status(400).json({status:false, msg:"first name should be only charactor"})
      }
      if(hasOwnProperty(email)){
          const checkEmail=await User.findOne({email:email});
          if(checkEmail){
            return res.status(400).json({status:false, msg:"same email not change"})
          }
      }
      if(validPwd(password)){
        return res.status(400).json({status:false, msg:"Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters"})
      }
      return res.status(200).json({status:true, msg:"Emp data Update Successfully", data:data})
    } catch (error) {
      console.log(error)
      res.status(500).json({status:false, msg:error})
    }
  }

  // =======================================Delete Employee============================

  
const deleteEmp=async (req,res)=>{
  try {
      const id=req.params.id;
      if(!isValidObjectId(id)){
          return res.status(400).json({status:false, msg:"invalid id "})
      }
      let result=await User.findByIdAndDelete(id)
      if(!result){
          return res.status(404).json({status:false, msg:"already deleted or not in db"})
      }
      return res.status(200).json({status:true, msg:"Emp deleted successfully",data:result})

  } catch (error) {
      console.log(error)
      return res.status(500).json({status:false, msg:"internal server error"})
  }
}


module.exports={createEmployee,empLogin,getAllEmp,getEmpById,updateEmp,deleteEmp}
