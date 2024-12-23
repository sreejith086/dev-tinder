const express = require("express");
const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require('bcrypt');
const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try {  
        const user = req.user;
        res.send(user);
    } catch(err){
       res.status(400).send("Error:"+ err.message)
    }
  });
  
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request!")
    }
    const loggedInUser = req.user;
    Object.keys((key)=>(loggedInUser[key]= req.body[key]));
    await loggedInUser.save();
    //res.send(`${loggedInUser.firstName},your profile updated successfully!.`)
    res.json({
      message:`${loggedInUser.firstName},your profile updated successfully!.`,
      data:loggedInUser
    })
  }catch(err){
       res.status(400).send("Error:"+ err.message)
    }
});

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user;
   
    const {password} = req.body;
    const currentPassword = loggedInUser.password;
    const newPasswordhash = await bcrypt.hash(password,10);
    const isPasswordValid = await loggedInUser.passwordValidate(password);
    console.log("isPasswordValid=",isPasswordValid);
    if(isPasswordValid){
        if(currentPassword!= newPasswordhash){
          loggedInUser[password] = newPasswordhash;
          loggedInUser.save();
          res.send("Password updated successfully!!")
        } else {
          throw new Error("Currentpassword and newpassword cannot be same!")
        }
    }  
  }catch(err){
    res.status(400).send("Error:"+ err.message)
 }
})

module.exports = profileRouter;