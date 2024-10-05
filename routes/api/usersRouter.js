import express from "express";  
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  updateAvatar, 
} from "../../controllers/userController.js";
import { authenticateToken } from "../../middlewares/auth.js";
// import { upload } from "../../middlewares/upload.js";
import multer from 'multer';
const upload = multer({ dest: 'tmp/' }); // Temporary folder for uploads

const router = express.Router();

// Sign up user
router.post("/signup", signupUser);  // POST: http://localhost:3000/api/users/signup

// Log in user
router.post("/login", loginUser);    // POST: http://localhost:3000/api/users/login

// Log out user
router.get("/logout", authenticateToken, logoutUser);  // GET: http://localhost:3000/api/users/logout

// Get current user
router.get("/current", authenticateToken, getCurrentUser);  // GET: http://localhost:3000/api/users/current

// Update user subscription
router.patch("/", authenticateToken, updateUserSubscription);  // PATCH: http://localhost:3000/api/users

// Update user avatar
router.patch("/avatars", authenticateToken, upload.single("avatar"), updateAvatar);  // PATCH: http://localhost:3000/api/users/avatars

export { router };
