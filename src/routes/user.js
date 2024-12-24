const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectRequest");

const userRouter = express.Router();
const USER_SAFE_DATABASE_DATA = "firstName lastName age gender photoUrl about skills"
//get all pending connection requests
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    console.log("reached");
    try {
        const loggedInUser = req.user;
        console.log("loggedinUser=",loggedInUser);
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"]);
 
        res.json({ message:"Data fetched successfully",
            data: connectionRequest
       })

    }catch(err){
        res.status(400).send("Error:"+err.message)
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
        $or:[
            { toUserId: loggedInUser._id,status:"accepted"},
            { fromUserId: loggedInUser._id,status:"accepted"},
        ]
    }).populate("fromUserId",USER_SAFE_DATABASE_DATA).populate("toUserId",USER_SAFE_DATABASE_DATA);
    console.log("connectionRequest="+connectionRequest);
    const data = connectionRequest.map((row)=>{ 
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
     });
    
    res.json({
        message:"Connections find successfully",
        data: data
    })
  }catch(err){
        res.status(400).send("Error:"+err.message)
  }
});

userRouter.get("/feed",userAuth, async(req,res)=>{
    try{
         //user shpuls see all cards excepts
        //1.his own card
        //2.his connections
        //3.ignored people
        //4.already sent the connection requests
        //rahul is new connections
        //Example - Rahul can see everyone except him-[ virat,dhoni,sanju,alia,hardik]
        const loggedInUser = req.user;
        const page = parseInt(req.query.page)||1;
        let limit = parseInt(req.query.limit)||10;
        limit = limit > 50? 50:limit;
        console.log("limit="+limit);
        const skip = (page-1)*limit;
        //find all connections(sent+recieved)
        const connectionRequests = await ConnectionRequestModel.find({
            $or:[{ fromUserId:loggedInUser._id},{ toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId");
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach( req=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        const users = await User.find({
          $and: [{_id: {$nin: Array.from(hideUsersFromFeed)},},{_id:{$ne: loggedInUser._id}}]
        }).select(USER_SAFE_DATABASE_DATA).skip(skip).limit(limit);
        // console.log("users="+users);
        //console.log(hideUsersFromFeed);
        res.send(users);

    }catch(err){
        res.status(400).send("Error:"+err.message)
    }
})
module.exports = userRouter;
