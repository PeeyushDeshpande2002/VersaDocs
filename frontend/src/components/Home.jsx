import React from "react";
import { Box, Container, Typography, Button, Card, CardContent } from "@mui/material";
import { CheckCircle, CloudUpload, Edit, Lock } from "@mui/icons-material";
import Navbar from "./Navbar";
import { useAuth } from "./contextAPI/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      {/* Background Section */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,rgb(227, 227, 227) 30%,rgb(189, 217, 241) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Card sx={{ p: 4, boxShadow: 6, borderRadius: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1976D2", mb: 2 }}>
                VersaDocs
              </Typography>
              <Typography variant="body1" sx={{ fontSize: "1.2rem", mb: 3 }}>
                Create, edit, and store documents seamlessly with Google Drive integration.
                Experience smooth collaboration with real-time updates.
              </Typography>

              {/* Features Section */}
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>
                🔥 Key Features
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <FeatureItem icon={<CheckCircle color="success" />} text="Google Sign-In for authentication" />
                <FeatureItem icon={<Edit color="primary" />} text="Create and edit text-based documents" />
                <FeatureItem icon={<CloudUpload color="secondary" />} text="Save and retrieve files from Google Drive" />
                <FeatureItem icon={<Lock color="error" />} text="Secure authentication with JWT tokens" />
              </Box>

              {/* Call to Action */}
              
                {isLoggedIn ? (
                   <Button
                   variant="contained"
                   color="primary"
                   sx={{ mt: 4, px: 4, py: 1.5, fontSize: "1.1rem", fontWeight: "bold", borderRadius: 2 }}
                   onClick={()=>navigate('/dashboard')}
                 > 
                 Go to Dashboard 🚀
                 </Button>
                ):(
                  <h1></h1>
                )}
                
              
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

// Reusable Feature Item Component
const FeatureItem = ({ icon, text }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "1rem" }}>
    {icon}
    <Typography variant="body1">{text}</Typography>
  </Box>
);

export default Home;
