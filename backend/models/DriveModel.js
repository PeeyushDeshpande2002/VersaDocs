import { google } from "googleapis";
import oauth2Client from "../config/googleAuth.js";
import { Readable, PassThrough } from "stream";
import axios from "axios";
import htmlDocx from "html-docx-js";
import mammoth from "mammoth";
import fs from 'fs';
const DriveModel = {
  uploadFile: async (accessToken, fileName, content) => {
    try {
      //console.log("Content Before Conversion:", content);
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: "v3", auth: oauth2Client });
      //console.log(typeof content)
      const blob = htmlDocx.asBlob(content);
      // console.log("Blob Size:", blob.size); // Check if it's non-zero
      // console.log("Blob Type:", blob.type);
      if (!blob) {
        throw new Error("Failed to generate DOCX blob.");
      }

      // Convert Blob to Buffer
      // const arrayBuffer = await blob.arrayBuffer();
      // const docxBuffer = Buffer.from(arrayBuffer);
      // console.log("DOCX Buffer Length:", docxBuffer.length); 
      // const docxStream = new PassThrough();
      // docxStream.end(docxBuffer);
      // await new Promise((resolve) => docxStream.on("finish", resolve));
      // console.log("DOCX Stream:", docxStream);
      // docxStream.on("data", (chunk) => console.log("Stream Chunk Size:", chunk.length));
      // docxStream.on("end", () => console.log("Stream ended"));

      const fileMetadata = {
        name: `${fileName}.docx`,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      const media = {
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          body: content,
      };

      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
      });
      //console.log(response.data);
      
      return response.data;
    } catch (error) {
      throw error;
    }
    // try {
    //   // Set OAuth2 credentials
    //   oauth2Client.setCredentials({ access_token: accessToken });
    //   const drive = google.drive({ version: "v3", auth: oauth2Client });
  
    //   // Convert HTML to DOCX
    //   const docxBlob = htmlDocx.asBlob(content);
    //   const arrayBuffer = await docxBlob.arrayBuffer();
    //   const docxBuffer = Buffer.from(arrayBuffer);
  
    //   // Write the DOCX file locally
    //   const tempFilePath = "temp.docx";
    //   fs.writeFileSync(tempFilePath, docxBuffer);
  
    //   console.log("DOCX File saved locally. Now uploading...");
  
    //   // Ensure the file exists before reading
    //   if (!fs.existsSync(tempFilePath)) {
    //     throw new Error("DOCX file not found!");
    //   }
  
    //   // Create a readable stream
    //   const docxStream = fs.createReadStream(tempFilePath);
  
    //   // Set metadata
    //   const fileMetadata = {
    //     name: `${fileName}.docx`,
    //     mimeType:
    //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //   };
  
    //   // Set media content
    //   const media = {
    //     mimeType:
    //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //     body: docxStream, // Use readable stream
    //   };
  
    //   // Use Resumable Upload
    //   const response = await drive.files.create({
    //     resource: fileMetadata,
    //     media: media,
    //     fields: "id",
    //   });
  
    //   console.log("File uploaded successfully:", response.data);
      
    //   // Clean up: Delete the temporary file after upload
    //   fs.unlinkSync(tempFilePath);
  
    //   return response.data;
    // } catch (error) {
    //   console.error("Error uploading file:", error);
    //   throw error;
    // }
  },
  getSingleFile: async (fileId, accessToken) => {
    try {
      const drive = google.drive({ version: "v3", auth: oauth2Client });
      oauth2Client.setCredentials({ access_token: accessToken });

      // Fetch file metadata
      const fileMetadata = await drive.files.get({
        fileId,
        fields: "id, name, mimeType",
      });

      const { id, name, mimeType } = fileMetadata.data;
      const fileResponse = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          responseType: "text/plain",
        }
      );
      //console.log(new Uint8Array(fileResponse.data));
      // const buffer = Buffer.from(fileResponse.data);
      // const htmlContent = await mammoth.convertToHtml({ buffer });
      // console.log(htmlContent);

      return {
        fileId: id,
        fileName: name,
        mimeType: mimeType,
        content: fileResponse.data,
      };
    } catch (error) {
      throw error;
    }
  },

  listFiles: async (accessToken) => {
    try {
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: "v3", auth: oauth2Client });

      const response = await drive.files.list({
        pageSize: 10,
        fields: "files(id, name)",
      });

      return response.data.files;
    } catch (error) {
      throw error;
    }
  },

  updateFile: async (fileId, fileName, content, accessToken) => {
    try {
      if (!content) throw new Error("newText is undefined"); 

      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: "v3", auth: oauth2Client });
      const requestBody = {
        name: `${fileName}.docx`, // Correctly set the filename
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Adjust if needed
      };
      const media = {
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Change to "text/html" if needed
        body: content,
      };

      const res = await drive.files.update({
        fileId,
        requestBody,
        media,
      });
      return { message: "File updated successfully" };
    } catch (error) {
      throw error;
    }
  },

  deleteFile: async (fileId, accessToken) => {
    try {
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: "v3", auth: oauth2Client });

      await drive.files.delete({ fileId });

      return { message: "File deleted successfully" };
    } catch (error) {
      throw error;
    }
  },
};

export default DriveModel;
