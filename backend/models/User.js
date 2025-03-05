import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  profilePic: String,
});

const User = mongoose.model("User", userSchema);
export default User;
