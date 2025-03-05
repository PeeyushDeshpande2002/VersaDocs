import admin from "../config/firebase.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
  const { token } = req.body;
  // console.log(req.body);
  
  try {
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, name, email, picture } = decodedToken;

    let user = await User.findOne({ uid });
    // console.log(user);
    
    if (!user) {
      user = new User({ uid, name, email, profilePic: picture });
      await user.save();
    }
    const jwtToken = jwt.sign({ uid, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({message : "User Logged In", jwtToken, user });
  } catch (error) {
    res.status(401).json({ error: "Invalid Firebase token" });
  }
};

export const protectedRoute = (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.user });
};
