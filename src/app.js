//console.log("Staring Nodejs Program..😊")
const express = require("express");
const {connectDb} = require("./config/database");

const User = require("./models/user");


const app = express();
app.post("/user",(req,res)=>{
    res.send("Data saved successfully to the database")
});
app.post("/signup",async(req,res)=>{
    console.log("reached");
   const user = User({ 
    firstName:"Unni",
    lastName:"unni",
    emailId: "unni@gmail.com",
    password:"unni@123"
   } );
   try {
    await user.save();
    res.send("user data saved successfully.")
   } catch(err){
    res.status(400).send("error saving the user:"+ err.message)
   }
 

})

connectDb().then(()=>{
        console.log("Database connected successfully..");
        app.listen(7777,()=>{
            console.log("Server is successfully listening on port 7777");
        });
    }).catch((err)=>{
        console.error("Database cannot boe connected",err)
    })
    

