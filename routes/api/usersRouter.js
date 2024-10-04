import express from "express";  
import { updateUserSubscription } from "./../../controllers/userController.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "./../../controllers/userController.js";
import {authenticateToken} from "../../middlewares/auth.js";
import { upload } from "../../middlewares/upload.js";

const router =express.Router();

router.post("/signup",signupUser);
router.post("/login",loginUser);
router.get("/logout", logoutUser);
router.get("/current",authenticateToken,getCurrentUser);
router.patch("/", authenticateToken, updateUserSubscription); // authenticate is middleware for user auth
router.patch("/avatars",authenticateToken,upload.single("avatar"),updateAvatar);

export {router};