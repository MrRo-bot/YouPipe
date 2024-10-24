import express, { json } from "express";
import { OAuth2Client } from "google-auth-library";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8089;

app.use(cors());
app.use(json());

const oAuth2Client = new OAuth2Client(
  process.env.VITE_YOUPIPE_CLIENT_ID,
  process.env.VITE_YOUPIPE_CLIENT_SECRET,
  "postmessage"
);

app.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  res.json(tokens);
});

app.post("/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // obtain new tokens
  res.json(credentials);
});

app.listen(PORT, () => console.log(`server is running`));
