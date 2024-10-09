import express from "express";  
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  updateAvatar, 
  verifyEmail,
    resendVerifyEmail,  // POST: http://localhost:4000/api/users/verify

} from "../../controllers/userController.js";
import { authenticateToken } from "../../middlewares/auth.js";
import multer from 'multer';
const upload = multer({ dest: 'tmp/' }); // Temporary folder for uploads

const router = express.Router();

// Sign up user
router.post("/signup", signupUser);  // POST: http://localhost:4000/api/users/signup

// Log in user4000/api/users/login
router.post("/login", loginUser);


// Log out user
router.get("/logout", authenticateToken, logoutUser);  // GET: http://localhost:4000/api/users/logout

// Get current user
router.get("/current", authenticateToken, getCurrentUser);  // GET: http://localhost:4000/api/users/current

// Update user subscription
router.patch("/", authenticateToken, updateUserSubscription);  // PATCH: http://localhost:4000/api/users

// Update user avatar
router.patch("/avatars", authenticateToken, upload.single("avatar"), updateAvatar);  // PATCH: http://localhost:4000/api/users/avatars

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", authenticateToken, resendVerifyEmail);

export { router };
