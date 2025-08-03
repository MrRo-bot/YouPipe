import express, { json } from "express"; //express package
import fs from "fs"; //reading files
import https from "https"; //creating https server
import { OAuth2Client } from "google-auth-library"; //google auth library for easy authentication
import cors from "cors"; //removing cors errors
import dotenv from "dotenv"; //for managing env related things
import morgan from "morgan"; //for logs

const requiredEnvVars = [
  "VITE_YOUPIPE_CLIENT_ID",
  "VITE_YOUPIPE_CLIENT_SECRET",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing environment variable: ${varName}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 8089;

//loading SSL certificate and private key created by choco mkcert package "mkcert localhost"
const privateKey = fs.readFileSync("localhost-key.pem", "utf8");
const certificate = fs.readFileSync("localhost.pem", "utf8");
const passphrase = "youpipe";
const credentials = { key: privateKey, passphrase, cert: certificate };

//creating an HTTPS server with my express app
const httpsServer = https.createServer(credentials, app);

dotenv.config();

//making express app use these things
app.use(morgan("combined")); //for logs
app.use(
  cors({
    origin: [process.env.VITE_FRONT_URL_PROD, process.env.VITE_FRONT_URL_DEV], //define frontend domains here
    credentials: true,
  })
);

app.use(json({ limit: "10kb" })); //setting reasonable payload limit to not overwhelm the server

//creating auth client with client id and secret
const oAuth2Client = new OAuth2Client(
  process.env.VITE_YOUPIPE_CLIENT_ID,
  process.env.VITE_YOUPIPE_CLIENT_SECRET,
  "postmessage"
);

//health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

//sending request to google servers with code to get token info
app.post("/auth/google", async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
    res.json(tokens);

    console.log(`authGoogle: ${JSON.stringify(tokens.expiry_date)}`);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).json({ error: "Failed to exchange code for tokens" });
  }
});

// New endpoint to refresh access token
app.post("/auth/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.body.refresh_token;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oAuth2Client.refreshAccessToken();
    res.json(credentials);

    console.log(`refreshed: ${JSON.stringify(credentials.expiry_date)}`);
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ error: "Failed to refresh access token" });
  }
});

// app.listen(PORT, () => console.log(`server is running`));
httpsServer.listen(PORT, () => {
  console.log("HTTPS server running on port: " + PORT);
});

//global error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

//Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing HTTPS server...");
  httpsServer.close(() => {
    console.log("HTTPS server closed.");
    process.exit(0);
  });
});
