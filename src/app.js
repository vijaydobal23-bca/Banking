const express = require("express");
const dotenv = require("dotenv");




dotenv.config();
const app = express();


app.get("/" ,(req ,res)=>{
  res.status(200).json({
    message:"The response is this",
    success:true
  })
})



module.exports = app;