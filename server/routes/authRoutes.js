// Imports
const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  verifyToken,
  resetPassword,
  getToken,
} = require("../controle/controleacces");

// Paramétrage du serveur,
router.use(
  cors({
    credentials: true,
    origin: "https://onegame.vercel.app",
  })
);

// Modules pour les routes, endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/disconnect", (req, res) => {
  res.clearCookie("token", { secure: true, httpOnly: true, sameSite: 'None' });;
  return res.json(null);
});
router.post('/forgotpassword', forgotPassword);
router.post('/verifytoken', (req, res) => {
  const {token} = req.body;
  return res.json(verifyToken(token));
});
router.post('/reset', resetPassword)
router.get('/token', getToken)

// Export
module.exports = router;
