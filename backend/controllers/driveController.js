import DriveModel from "../models/DriveModel.js";

export const uploadFile = async (req, res) => {
  try {
    const accessToken = req.headers.accesstoken;
    if (!accessToken) return res.status(401).json({ error: "No access token" });

    const { fileName, content } = req.body;
    if (!fileName)
      return res.status(400).json({ error: "File name is required" });
    if (!content)
      return res.status(400).json({ error: "File content is required" });
    const result = await DriveModel.uploadFile(accessToken, fileName, content);
    res.json({ fileId: result.id, message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getSingleFile = async (req, res) => {
  try {
    const accessToken = req.headers.accesstoken;
    const { fileId } = req.params;

    if (!accessToken) return res.status(401).json({ error: "No access token" });

    const fileData = await DriveModel.getSingleFile(fileId, accessToken);

    res.json({
      fileName: fileData.fileName,
      content: fileData.content,
      mimeType: fileData.mimeType,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listFiles = async (req, res) => {
  try {
    const accessToken = req.headers["accesstoken"];
    if (!accessToken) return res.status(401).json({ error: "No access token" });
    const result = await DriveModel.listFiles(accessToken);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const updateFile = async (req, res) => {
  try {
    const accessToken = req.headers.accesstoken;
    const { content, fileName } = req.body;
    const { fileId } = req.params;

    if (!accessToken) return res.status(401).json({ error: "No access token" });

    const result = await DriveModel.updateFile(fileId, fileName, content, accessToken);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const deleteFile = async (req, res) => {
  try {
    const accessToken = req.headers.accesstoken;
    const { fileId } = req.params;

    if (!accessToken) return res.status(401).json({ error: "No access token" });

    const result = await DriveModel.deleteFile(fileId, accessToken);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
