
import {signupValidation,subscriptionValidation,emailValidation} from "../validation/validation.js"
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import {User} from "../models/usersModel.js";
import gravatar from "gravatar";//avatars
import path from "path";//for url path
import {Jimp} from "jimp";//image processing and manipulation//resizing
import fs from "fs/promises";
import { sendEmail } from "../helpers/sendEmail.js";
// import { nanoid } from "nanoid";

const {SECRET_KEY} = process.env;
// Sign up User
const signupUser =async(req,res)=>{
  try {
    const { email, password } = req.body;
    const {error} = signupValidation.validate(req.body);
  //Registration validation error
    if(error){
      return res.status(400).json({ message: error.message });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
      return res.status(409).json({message: "Email in use"});
    }
    // Hash the password
    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
//sets a global avatar uniquely to an email
//2 param email, object containing protocol:"https"
//avatar -placeholder only when user signs in
  const avatarURL= gravatar.url(email,{protocol:"http"});

    // Store the user with the hashed password in your database
    const newUser = await User.create({ 
      email, 
      password: hashedPassword,
    avatarURL, 
  });

      //Registration success response
    res.status(201).json({
      user:{
        email:newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};
//loginuser
const loginUser = async(req,res)=>{
  try {
    const { email, password } = req.body;

    const { error } = signupValidation.validate(req.body);
    if (error) {
      return res.status(401).json({ message: error.message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const payload = { id: user._id };
    // this generates a unique signature for our web token that only the person with the correct secret key can decode
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//logoutUser
const logoutUser = async(req,res)=>{
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
const getCurrentUsers =async(req,res) =>{
  try {
    const { email,subscription  } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
const updateUserSubscription = async (req, res) => {
  try {
    const { error } = subscriptionValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
  // Update the user's subscription
    const { _id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    res.json({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  await Jimp.read(oldPath).then((image) =>
    // image.resize(250, 250).write(oldPath)
    image.cover(250, 250).write(oldPath)
  );

  const extension = path.extname(originalname);
  const filename = `${_id}${extension}`;

  const newPath = path.join("public", "avatars", filename);
  await fs.rename(oldPath, newPath);

  let avatarURL = path.join("/avatars", filename);
  avatarURL = avatarURL.replace(/\\/g, "/");

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
}
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found! Please try again. " });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error happened. " });
  }
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  // Resending email validation error
  const { error } = emailValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = await User.findOne({ email });

    // Email not found
    if (!user) {
      return res
        .status(404)
        .json({ message: "The provided email address could not be found" });
    }

    // Resend email for verified user
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    await sendEmail({
      to: email,
      subject: "Action Required: Verify Your Email",
      html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
    });

    // Resending a email success response
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    // Internal server error handling
    res.status(500).json({ message: "Internal server error" });
  }
};
// MVC Architecture
export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUsers,
  updateUserSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,  // POST: http://localhost:4000/api/users/verify
};


//1.validate request using joi
//2. validate if email is existing
//3.if email exist -compare or decryptthe hashedpassword to the password
//4. if decryption is sucesseful , we will generate a token to the user
//the user will apply the token as an authentication for all future request