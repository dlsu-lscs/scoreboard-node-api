import * as AuthService from "../services/auth.service.js";

export function getLoginUrl(req, res) {
  try {
    const loginUrl = AuthService.buildLoginUrl();
    res.json({ loginUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}