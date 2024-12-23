const mongoose = require('mongoose');

const connectionRequestShema = new mongoose.Schema({
    fromUserId:{
      type: mongoose.Schema.Types.ObjectId,
      required:true
    },
    toUserId:{
      type: mongoose.Schema.Types.ObjectId,
      required:true
    },
    status:{
       type: String,
       required:true,
       enum :{
        values:["rejected","accepted","ignored","interested"],
        message:`{VALUE} is incorrect status type`
       }
       
    }
  },
    {
        timestamps: true
    }
);
connectionRequestShema.index({ fromUserId:1,toUserId:1});
connectionRequestShema.pre("save",function(next){
   const connectionRequest = this;
   //check fromuser and touser same or not
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("You cannot send connection request to yourself");  
   }
   next();
})

const ConnectionRequestModel = new mongoose.model('ConnectionRequest',connectionRequestShema);
module.exports = ConnectionRequestModel;