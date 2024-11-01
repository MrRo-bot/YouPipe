import express, { json } from "express";
import fs from "fs"; //reading files
import https from "https"; //creating https server
import { OAuth2Client, UserRefreshClient } from "google-auth-library"; //google auth library for easy authentication
import cors from "cors"; //removing cors errors

const app = express();
const PORT = process.env.PORT || 8089;

//loading SSL certificate and private key created by choco mkcert package "mkcert localhost"
const privateKey = fs.readFileSync("./src/server/localhost-key.pem", "utf8");
const certificate = fs.readFileSync("./src/server/localhost.pem", "utf8");
const passphrase = "youpipe";
const credentials = { key: privateKey, passphrase, cert: certificate };

//creating an HTTPS server with my express app
const httpsServer = https.createServer(credentials, app);

//defining middleware to redirect http to https
function ensureSecure(req, res, next) {
  if (req.secure) {
    //request is already secure
    return next();
  }
  //redirect to https
  res.redirect("https://" + req.hostname + req.originalUrl);
}

//making express app use these things
app.use(ensureSecure);
app.use(cors());
app.use(json());

//creating auth client with client id and secret
const oAuth2Client = new OAuth2Client(
  process.env.VITE_YOUPIPE_CLIENT_ID,
  process.env.VITE_YOUPIPE_CLIENT_SECRET,
  "postmessage"
);

//sending request to google servers with code to get token info
app.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  res.json(tokens);
});

// app.listen(PORT, () => console.log(`server is running`));
httpsServer.listen(PORT, () => {
  console.log("HTTPS server running on port: " + PORT);
});
