const { User } = require("../Modals/userSchema");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup route
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide all fields",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(401).json({
        status: "failure",
        message: "User already exists. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      text: `Hi ${name},\nYou have signed up successfully.`,
    };

    transporter.sendMail(mailOptions);

    // Hide password before sending response
    user.password = undefined;

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("I am logging in...");

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide both email and password.",
    });
  }

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User doesn't exist. Please sign up first.",
      });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP code",
        text: `Hi ${user.name},\nThis is your OTP: ${otp}`,
      };

      transporter.sendMail(mailOptions);

      return res.status(200).json({
        status: "success",
        message: "OTP has been sent to your email address. Please verify.",
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

// Login with OTP
exports.loginWithOtp = async (req, res) => {
  console.log("I am logging in with OTP...");
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const user = await User.findOne({ email, otp });
    console.log(`User found: ${user}`);

    if (!user) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      { userid: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Cookies
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.status(200).cookie("token", token, options).json({
      status: "success",
      message: "You are successfully logged in!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
    });
  }
};

exports.auth = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(`This is the token: ${token}`);

  if (!token) {
    return res.status(404).json({
      message: "Invalid request",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userid;
    next();
  } catch (error) {
    console.error(error);
  }
};

exports.getuser = async (req, res) => {
  console.log("I am getuser");
  try {
    // Assuming req.user contains the user ID
    const userId = req.id; // Adjust this based on your actual user data structure
    console.log(req.id);
    const user = await User.findById(userId).select("-__v");
    console.log(user);
    user.password = undefined;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log(user);
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(404).json({
      message: "Internal server error",
      data: error,
    });
  }
};

exports.transaction = async (req, res) => {
  const { email, amount } = req.body;
  console.log(`This is the email: ${email}`);

  try {
    const fromUser = await User.findById(req.id);
    const toUser = await User.findOne({ email: email });

    if (!toUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (fromUser.balance < amount) {
      return res.status(404).json({
        status: "fail",
        message: "You don't have enough money in your account",
      });
    }

    fromUser.balance -= amount;
    toUser.balance += amount;
    await fromUser.save();
    await toUser.save();

    res.status(200).json({
      status: "success",
      message: "Transfer successful",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "Something went wrong. Please try again!",
    });
  }
};
