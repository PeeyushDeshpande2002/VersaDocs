import React, { useEffect, useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Navbar from "./Navbar";
import { Box, Button, TextField } from "@mui/material";

//const API_BASE_URL = "http://localhost:5000/api"; // Backend API
const API_BASE_URL = "https://versadocs.onrender.com/api"

const TextEditor = () => {
  const { docId } = useParams();
  const [fileName, setFileName] = useState("UntitledDocument");
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const accessToken = localStorage.getItem("googleAccessToken");
  const jwtToken = localStorage.getItem("jwtToken");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // const convertArrayBufferToString = async (arrayBuffer) => {
  //   try {
  //     const decoder = new TextDecoder("utf-8");
  //     console.log(decoder.decode(arrayBuffer));
  //     return decoder.decode(arrayBuffer);
  //   } catch (error) {
  //     console.error("Error decoding DOCX content:", error);
  //     return "Error loading document"; 
  //   }
  // };

  useEffect(() => {
    if (docId !== "new") {
      fetch(`${API_BASE_URL}/drive/file/${docId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          accessToken: accessToken,
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          console.log(data.content);
          const decodedContent = data.content; 
          setContent(decodedContent);
          const cleanFileName = data.fileName.replace(/\.(docx|doc|txt|pdf)$/i, "");
          setFileName(cleanFileName || "UntitledDocument");
        })
        .catch((err) => console.error("Error fetching document:", err));
    }
  }, [docId]);

  const saveDocument = async () => {
    const method = docId === "new" ? "POST" : "PUT";
    const endpoint = docId === "new" ? "/upload" : `/edit/${docId}`;

    if (!content) {
      console.error("Content is empty or undefined");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/drive${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
        accessToken: accessToken,
      },
      body: JSON.stringify({ fileName: fileName, content: content }),
    });

    if (res.ok) {
      console.log("Document saved successfully!");
      enqueueSnackbar("Document saved successfully!", { variant: "success" });
      navigate("/dashboard");
    } else {
      console.error("Failed to save document");
      enqueueSnackbar("Failed to save document", { variant: "error" });
    }
  };
  const config = {
    readonly: false,
    height: 400,
    toolbarButtonSize: 'middle'
};
  return (
    <>
    <Navbar/>
    <Box
        sx={{
          mt: "80px", // Push content below navbar
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(100vh - 80px)", // Full-page editor minus navbar height
          p: 2,
        }}
      >
      <TextField
          variant="outlined"
          fullWidth
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          sx={{
            maxWidth: "800px",
            fontSize: "18px",
            mb: 2,
            backgroundColor: "#fff",
            boxShadow: 2,
            borderRadius: 1,
          }}
          label="Document Name"
        />
        <Box
          sx={{
            width: "100%",
            maxWidth: "1000px",
            flexGrow: 1, // Takes up remaining space
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => {}}
      />
        </Box>
      
        <Button
          onClick={saveDocument}
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            px: 4,
            py: 1.2,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          Save Document 💾
        </Button>
      </Box>
    </>
  );
};

export default TextEditor;
