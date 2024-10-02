import express from "express";  
import { updateUserSubscription } from "./../../controllers/userController.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "./../../controllers/userController.js"
import authMiddleware from '../middleware/authMiddleware.js';

const router =express.Router();

router.post("/users/signup",signupUser);
router.post("/users/login",loginUser);
router.get("user/logout",logoutUser);
router.get("user/current",authMiddleware,getCurrentUser);
router.patch('/subscription',authMiddleware, updateUserSubscription); // authenticate is middleware for user auth

export {router};