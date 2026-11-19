const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
    unique:[true , "Email already exists"],
  },


  name : {
    type:String,
    required:[true , "Please provide a name"],
  },

  password:{
    type:String,
    required:[true , "Please provide a password"],
    minlength:[6 , "Password must be at least 6 characters long"]
  }
},{timestamps:true});

userSchema.pre("save" , async function(next){
  if(!this.isModified("password")){
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});


userSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword , this.password);
}

const userModel = mongoose.model("User" , userSchema);
module.exports = userModel;
