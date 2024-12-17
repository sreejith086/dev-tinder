//console.log("Staring Nodejs Program..😊")
const express = require("express");
const app = express();
const {adminAuth ,userAuth } = require('./middlewares/auth');

//Handle the auth middleware for all get,post.. request
app.use("/admin",adminAuth);
app.get("/user/login",(req,res)=>{
    res.send("User logined successfully...")
})
// app.use("/admin",(req,res,next)=>{
//    const token ='1234';
//    const isAdminAuthorized = token === '12342';
//    if(!isAdminAuthorized){
//     res.status(401).send("unauthorized requets!")
//    }else {
//     next();
//    }
// });
app.get("/admin/getAlldata",(req,res)=>{
    res.send("Get All user data")
});
app.delete("/admin/deleteuser",(req,res)=>{
    res.send("User data deleted successfully!")
});
app.get("/user/getData",userAuth,(req,res)=>{
    res.send("Get User Data...")
})



app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777");
});