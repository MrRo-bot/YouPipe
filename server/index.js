import express, { json } from "express"; //express package
import { OAuth2Client } from "google-auth-library"; //google auth library for easy authentication
import cors from "cors"; //removing cors errors
import dotenv from "dotenv"; //for managing env related things
import morgan from "morgan"; //for logs

//loading env vars
dotenv.config();

//validating required env vars
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

//Initializing the express app
const app = express();

//making express app use these things
app.use(morgan("combined")); //for logs
app.use(
  cors({
    origin: [process.env.VITE_FRONT_URL_PROD, process.env.VITE_FRONT_URL_DEV], //define frontend domains here
    // methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(json({ limit: "10kb" })); //setting reasonable payload limit to not overwhelm the server

//global error handler middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

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

app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
}); //vercel

// Optional: Start server for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8089;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

//Graceful shutdown
if (process.env.NODE_ENV !== "production") {
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing HTTPS server...");
    app.close(() => {
      console.log("HTTPS server closed.");
      process.exit(0);
    });
  });
}

export default app;
