const User=require('../models/userModel')
const {isValid,isValidBody,validString,validEmail,validPwd,isValidObjectId, validEmpId}=require('../util/validtion')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')

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
    return res.status(400).json({status:false, msg:"employee id is requied"})
  }
  let checkEmployeeId=await User.findOne({employeeId:employeeId});
  if(checkEmployeeId){
    // console.log("hiii")
    return res.status(400).json({status:false, msg:"duplicate emp id not allowed"})
  }
  if(!validEmpId(employeeId)){
    return res.status(400).json({status:false, msg:"employee id only be number"})
  }
  if(!password){
    return res.status(400).json({status:false, msg:"password is requried"})
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
      const allEmp=await User.find().sort({fName:1})

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
         if(!chechID){
          return res.status(400).json({status:false, msg:"wrong employee id"})
         }
          res.status(200).json({status:true, msg:"find employee by id ",data:chechID})
         
    } catch (error) {
       console.log(error)
       res.status(500).json({status:false, status:error})
    }
  }

  // ================================Update Employee =================

  const updateEmp=async (req,res)=>{
    try {
      let id=req.params.id;
      let checkEmpId=await User.findById(id);
      if(!checkEmpId){
        return res.status(400).json({status:false, msg:"not found the employee"})
      }
      let data=req.body;
      let {fName,lName,email,password,orgName,employeeId}=data
      let empUpdate={}
      if(isValidBody(data)){
        return res.status(400).json({status:false, msg:"data is requried to anything to be updated"})
      }
      if(fName){
        if(validString(fName)){
          return res.status(400).json({status:false, msg:"fName should be only string"})
        }else if(isValid(fName)){
          return res.status(400).json({status:false, msg:"if emplty then not change"})
        }
       
        empUpdate.fName=fName
      }

      if(lName){
        if(validString(lName)){
          return res.status(400).json({status:false, msg:"lName should be only string"})
        }else if(isValid(lName)){
          return res.status(400).json({status:false, msg:"if emplty then not change"})
        }
        empUpdate.lName=lName
      }

      if(orgName){
        if(validString(orgName)){
          return res.status(400).json({status:false, msg:"orgName should be only string"})
        }else if(isValid(orgName)){
          return res.status(400).json({status:false, msg:"if emplty then not change"})
        }
        empUpdate.orgName=orgName
      }

      if(employeeId){
        if(validEmpId(employeeId)){
          return res.status(400).json({status:false, msg:"employee only be number"})
        }else if(isValid(employeeId)){
          return res.status(400).json({status:false, msg:"if chenge then requeired"})
        }
        const validEmp=await User.findOne({employeeId:employeeId})
        if(validEmp){
          return res.status(400).json({status:false, msg:"same emeployee id not be change"})
        }
        empUpdate.employeeId=employeeId;
      }

      if(email){
        if(validEmail(email)){
          return res.status(400).json({status:false, msg:"enter a valid email"})
        }else if(isValid(email)){
          return res.status(400).json({status:false, msg:"if chenge then requeiredemail"})
        }
        const validEmail=await User.findOne({email:email})
        if(validEmail){
          return res.status(400).json({status:false, msg:"same email id not be change"})
        }
        empUpdate.email=email;
      }

      if(password){
        if(validPwd(password)){
          return res.status(400).json({status:false, msg:"Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters"})
        }
        // else if(isValid(password)){
        //   return res.status(400).json({status:false, msg:"if chenge then requeired email"})
        // }
        const validPassword=await User.findOne({password:password})
        if(validPassword){
          return res.status(400).json({status:false, msg:"same password not be change"})
        }
        empUpdate.password=password;
      }
      const update=await User.findOneAndUpdate(id,empUpdate,{new:true})
      return res.status(200).json({status:true, msg:"Emp data Update Successfully", data:update})
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
