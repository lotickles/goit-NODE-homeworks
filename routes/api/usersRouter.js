import express from "express";  
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "./../../controllers/userController.js"
const router =express.Router();

router.post("/users/signup",signupUser);

router.post("/users/login",loginUser);
router.get("user/logout", logoutUser);
router.get("user/current",getCurrentUser);

export {router};