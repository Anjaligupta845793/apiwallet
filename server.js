require("dotenv").config();
const express = require("express");
const connectdb = require("./dbconfig");
const cookieParser = require("cookie-parser");
const {
  signup,
  login,
  loginWithOtp,
  getuser,
  auth,
  transaction,
} = require("./controller/userController");

const app = express();
app.use(express.json());
app.use(cookieParser());
connectdb();

// Signing up user
app.post("/signup", signup);

// Signing up with OTP
app.post("/loginWithOtp", loginWithOtp);

// Sign in user
app.post("/login", login);

// User details
app.get("/userdetails", auth, getuser);

// Transfer route
app.post("/transfer", auth, transaction);

app.listen(5000, () => {
  console.log("Server is running, and app is listening on port 5000");
});
