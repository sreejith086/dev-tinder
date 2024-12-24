const express = require("express");
const requestRouter = express.Router(); 
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:touserId",userAuth,async(req,res)=>{
   try {
     const fromUserId = req.user._id;
     const toUserId= req.params.touserId;
     const status = req.params.status;
     const allowedStatus= ['ignored',"interested"];
     console.log("status="+status)
     if(!allowedStatus.includes(status)){
        return res.status(400).json({ message:"Invalid status type!"+status})
     }
     
     //if theres an existing connection
     const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId},
      ]
     });
     const toUser = await User.findById(toUserId);
     if(!toUser){
      return res.status(400).json({
        message:"User Not Found"
      })
     }
     if(existingConnectionRequest){
      return res.status(400).json({ message:"Connection request already exists"})
     }
     const connectionRequest = new ConnectionRequestModel({
      fromUserId,toUserId,status
     });
     console.log("data==",connectionRequest)
     const data = await connectionRequest.save();
     console.log("data==",data)
     res.json({ 
         message:req.user.firstName+" is "+status+" in "+toUser.firstName,
         data: data
     });
   }catch(err){
    res.status(400).send("Error:"+err.message)
   }
  });

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user;
    const {status,requestId } = req.params;
    const allowedStatus= ['accepted',"rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message:'status is not allowes'
      })
    }

    const connectionRequest =  await  ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status:'interested'
     });

     if(!connectionRequest){
      return res.status(400).json({
        message:'connection request not found!'
      })
     }
     connectionRequest.status = status;
     const data = await connectionRequest.save();
     res.json({
       message:"Connection request "+ status,
       data: data
     })

  }catch(err){
    res.status(400).send("Error:"+err.message)
   }
})

module.exports = requestRouter;