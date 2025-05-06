// Import_DB
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // Check Required
    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All feilds are reuired" });
    // Check Email
    const existimgEmail = await User.findOne({ email });
    if (existimgEmail)
      return res.status(400).json({ message: "Email already exists" });

    // Check Username
    const existingName = await User.findOne({ name });
    if (existingName)
      return res.status(400).json({ message: "Username already exists" });

    // Confirm password
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password is not match" });

    // Check length password
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    // Check Password Strength (Uppercase & Number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter and one number",
      });

    // hashPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save User to db
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // gen token
    const token = jwt.sign(
      { userID: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // cookie
    res.cookie("jwt-yamleaves", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ user });

    // todo: send welcome email
  } catch (error) {
    console.log("Error in sign uo controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create & send token
    const token = jwt.sign(
      { userID: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await res.cookie("jwt-yamleaves", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({ user: userWithoutPassword }); 
  } catch (error) {
    console.log("Error in logged in controller!!", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt-yamleaves");
  res.json({ message: "Logged out successfully" });
};

exports.getCurrentUser = (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getCurrentUser controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};
