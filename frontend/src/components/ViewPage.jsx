import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    CircularProgress,
    Paper,
    Typography,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Navbar from "./Navbar";

const API_BASE_URL = "http://localhost:5000/api";

const ViewPage = () => {
    const { docId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const accessToken = localStorage.getItem("googleAccessToken");
    const jwtToken = localStorage.getItem("jwtToken");

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/drive/file/${docId}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        accessToken: accessToken,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched Content:", data.content);
                    const cleanFileName = data.fileName.replace(/\.(docx|doc|txt|pdf)$/i, "");
                    
                    setContent(data.content);
                    setFileName(cleanFileName);
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [docId]);

    const handleEditClick = () => {
        setOpenDialog(true);
    };

    const handleConfirmEdit = () => {
        setOpenDialog(false);
        navigate(`/texteditor/${docId}`); // Navigate to text editor
    };

    return (
        <>
            <Navbar />
        <Container maxWidth="md" sx={{ mt: 15  }}> {/* Added margin-top */}
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: "#f5f5f5" }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="bold">
                                📄 {fileName || "Untitled Document"}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={handleEditClick}>
                                Edit
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: 1,
                                p: 2,
                                mt: 2,
                                minHeight: "250px",
                                backgroundColor: "#ffffff",
                                fontFamily: "Georgia, serif",
                                lineHeight: "1.6",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            }}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </Paper>
                )}
            </Container>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Edit</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to edit this document?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleConfirmEdit} color="primary" variant="contained">Yes, Edit</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewPage;
