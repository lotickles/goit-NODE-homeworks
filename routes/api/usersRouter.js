import {Router} from "express";
import multer from "multer";
import express from "express";  
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  updateAvatar, 
} from "./../../controllers/userController.js";
import {authenticateToken} from "../../middlewares/auth.js";
import { upload } from "../../middlewares/upload.js";

const router =express.Router();
// const router =Router();
// const upload = multer({dest:"tmp/"})

router.post("/signup",signupUser);/* POST: // http://localhost:3000/api/users/signup */
router.post("/login",loginUser);/* POST: // http://localhost:3000/api/users/login */
router.get("/logout", logoutUser);/* GET: // http://localhost:3000/api/users/logout */
router.get("/current",authenticateToken,getCurrentUser);/* GET: // http://localhost:3000/api/users/current */
router.patch("/", authenticateToken, updateUserSubscription); /* PATCH: // http://localhost:3000/api/users/ */
router.patch("api/users/avatars",authenticateToken,upload.single("avatar"),updateAvatar);
//route,authentication,middleware upload and single function of multer to restrict to one field ("fieldname"),controller

export {router};