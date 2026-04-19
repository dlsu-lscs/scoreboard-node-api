import * as AuthService from "../services/auth.service.js";

export async function getLoginUrl(req, res) {
  try {
    const loginUrl = await AuthService.buildLoginUrl();
    res.status(200).json({ loginUrl: loginUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLoginPage(req, res) {
  try {
    const provider = req.query.provider || "google";
    const callbackURL = req.query.callbackURL || "http://localhost:3000/";
    const html = await AuthService.buildLoginPage({ provider, callbackURL });
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
