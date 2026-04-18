const express = require("express");
const router = express.Router();

const { 
  registerUser, 
  loginUser,
  resetPassword,
  updateProfile 
} = require("../controllers/userController");

router.get("/test-user", (req, res) => {
  res.json({ message: "User route funcionando" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/reset-password", resetPassword);
router.put("/update-profile", updateProfile);
router.post("/request-reset-code", requestResetCode)

module.exports = router;