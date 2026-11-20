
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../services/mail.service");


async function userRegisterController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all the required fields",
        success: false,
      });
    }

    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const user = await userModel.create({ name, email, password });

    let emailSent = true;
    try {
      await sendRegistrationEmail({ to: user.email, name: user.name });
    } catch (mailError) {
      emailSent = false;
      console.error("Registration email could not be sent:", mailError.message);
    }

    // Never return the password hash in the API response.
    user.password = undefined;

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      emailSent,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}


async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
        success: false,
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}


async function userLogoutController(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}




module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,

};
