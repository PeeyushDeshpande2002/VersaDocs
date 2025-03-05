import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  CardActionArea,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("googleAccessToken");
  const jwtToken = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/drive/files`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          accessToken: accessToken,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDocs(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (docId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/drive/delete/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          accessToken: accessToken,
        },
      });
      if (res.ok) {
        setDocs(docs.filter((doc) => doc.id !== docId));
        fetchDocs();
        enqueueSnackbar("Successfully Deleted The Document!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      enqueueSnackbar("Error deleting document", { variant: "error" });
    }
  };

  const handleMenuOpen = (event, docId) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocId(docId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocId(null);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" style={{ marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Documents
        </Typography>

        {loading ? (
          <CircularProgress style={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                onClick={() => navigate(`/texteditor/new`)}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "150px", // Fixed height for consistency
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    + Add New Document
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {docs.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id}>
                <Card style={{ position: "relative", height: "150px" }}>
                  <CardActionArea
                    onClick={() => navigate(`/view/${doc.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{doc.name}</Typography>
                    </CardContent>
                  </CardActionArea>

                  <IconButton
                    style={{ position: "absolute", top: 5, right: 5 }}
                    onClick={(e) => handleMenuOpen(e, doc.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Menu for actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => navigate(`/texteditor/${selectedDocId}`)}>
            Edit
          </MenuItem>
          {/* <MenuItem onClick={() => navigate(`/view/${selectedDocId}`)}>
            View
          </MenuItem> */}
          <MenuItem onClick={() => handleDelete(selectedDocId)}>
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </>
  );
};

export default Dashboard;
