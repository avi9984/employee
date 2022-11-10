const express=require('express')
const route=require('./route/router')
const app=express()
const bodyParser=require('body-parser')
const { default: mongoose } = require('mongoose')
const PORT=process.env.PORT || 4000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://Avi9984:JM6hnTiQIRViVdA3@cluster0.qfc4n.mongodb.net/Employee-Registration",{
    useNewUrlParser:true
})
.then(()=>console.log("MongoDB is connected!...."))
.catch((err)=>{
    console.log(err)
})

app.use('/',route)
app.listen(PORT,()=>{
    console.log(`Server is running in the port is: ${PORT}`)
})

