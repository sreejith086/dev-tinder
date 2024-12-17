//console.log("Staring Nodejs Program..😊")
const express = require("express");

const app = express();
app.use("/user",(req,res,next)=>{
    //res.send("Staring Nodejs Program- first response");
    console.log("response 1")
    next();
},[(req,res,next)=>{
    console.log("Response 2");
   // res.send("Response 2");
    next();
},(req,res,next)=>{
    console.log("Response 3");
    res.send("Response 2")
   //next();
}]);


app.listen(7777,()=>{
    console.log("Server is successfully listening on port 7777");
});