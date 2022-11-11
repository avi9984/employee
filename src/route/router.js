const express=require('express')
const router=express.Router();
const User=require('../controller/userController')

router.post('/create/employee', User.createEmployee)
router.post('/emp/Login',User.empLogin)
router.get('/getAll/emp',User.getAllEmp)
router.get('/getEmp/:id',User.getEmpById)
router.put('/updateEmp/:id',User.updateEmp)
router.delete('/deleteEmp/:id',User.deleteEmp)

module.exports=router;
