const express = require("express");
const { validateSignupData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');

const authRouter = express.Router();
authRouter.post("/signup",async(req,res)=>{
    try {
     //validation of data
    validateSignupData(req);
    const {firstName,lastName,emailId,password,skills} = req.body;
    //encrypt the password and stored into the db
    const passwordhash = await bcrypt.hash(password,10);
    const user =  new User({
      firstName,lastName,emailId,skills,password:passwordhash
    });
     await user.save();
     res.send("user data saved successfully.")
    } catch(err){
     res.status(400).send("error saving the user:"+ err.message)
    }
 });
 authRouter.post("/login",async (req,res)=>{
    try {
      const {emailId , password} = req.body;
      const user = await User.findOne({emailId: emailId});
      if(!user){
        throw new Error("Invalid credentials")
      }
      //const isPasswordValid = await  bcrypt.compare(password,user.password);
      const isPasswordValid = await user.passwordValidate(password);
      if(isPasswordValid){
        //create JWT Token
         //const token = jwt.sign({_id:user._id},"Devtinder@123",{expiresIn:"1d"});
         const token = await user.getJWT();
        //Add the token to the cookie and send the response back to the user
        res.cookie("token",token,{ expires: new Date(Date.now() + 8* 360000), httpOnly: true });
        res.send("Login successful");
      } else {
        throw new Error("Invalid credentials")
      }
    } catch(err){
      res.status(400).send("Error:"+ err.message)
    }
  });

  authRouter.post("/logout",async(req,res)=>{
    //clean up activities

    res.clearCookie('token');
    res.cookie("token",null,{ expires: new Date(Date.now()),});
    res.send("Logout succesful!");
    //res.cookie("token",null,{ expires: new Date(Date.now()),}).send("Logout succesful!");

  })
module.exports = authRouter;