import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata"
];

export const setCredentials = async (tokens) => {
  oauth2Client.setCredentials(tokens);
  
  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      console.log("Token refreshed successfully!");
      return credentials;
    } catch (error) {
      console.error("Error refreshing token:", error.message);
      throw new Error("Failed to refresh access token");
    }
  }

  return tokens;
};

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
};

export default oauth2Client;
