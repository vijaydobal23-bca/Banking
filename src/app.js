const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");


dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth" , authRoutes);
app.use(cookieParser());

app.get("/" ,(req ,res)=>{
  res.status(200).json({
    message:"The response is this",
    success:true
  })
})



module.exports = app;