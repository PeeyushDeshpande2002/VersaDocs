import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

