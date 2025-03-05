import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { auth, provider, signInWithPopup, GoogleAuthProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contextAPI/AuthContext";
import { useSnackbar } from "notistack";
// const API_BASE_URL = 'http://localhost:5000/api'
const API_BASE_URL = "https://versadocs.onrender.com/api"
const Navbar = () => {
  const { isLoggedIn, logout, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/drive.file");  
  provider.addScope("https://www.googleapis.com/auth/drive.appdata");  

  const {enqueueSnackbar} = useSnackbar();
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      const accessToken = credential.accessToken;
      localStorage.setItem("googleAccessToken", accessToken);
      const user = result.user;

      // Get Firebase ID Token
      const token = await user.getIdToken();

      // Send Token to Backend
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        login(data.jwtToken);
        navigate("/");
        enqueueSnackbar('Successfully Signed In!', {variant : 'success'})
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      enqueueSnackbar('Google Sign-In Error', {variant : 'error'})
    }
    setLoading(false);
  };
  const handleLogout = () => {
    logout();
    enqueueSnackbar('Successfully Logged Out!', {variant : 'success'})
    navigate("/"); 
  };
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1976D2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/")}>
          VersaDocs
        </Typography>

        <div>
          {isLoggedIn && (
            <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          )}
          {isLoggedIn ? (
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick = {handleGoogleSignIn}>
              Sign In With Google
              </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
