
import {signupValidation,subscriptionValidation,emailValidation} from "../validation/validation.js"
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import {User} from "../models/usersModel.js";
import gravatar from "gravatar";//avatars
import path from "path";//for url path
import {Jimp} from "jimp";//image processing and manipulation//resizing
import fs from "fs/promises";
import { nanoid } from "nanoid";

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
  
  const verificationToken = nanoid();

  // ADDITIONALLY, UPON SIGNUP, THE NODEMAILER MUST SEND A VERIFICATION EMAIL TO THE EMAIL BEING SIGNED UP
  // Send an email to the user's mail and specify a link to verify the email (/users/verify/:verificationToken) in the message
  await sendEmail({
    to: email, // recipient
    subject: "Action Required: Verify Your Email",
    html: `<a target="_blank" href="http://localhost:${PORT}/api/users/verify/${verificationToken}">Click to verify email</a>`,
  });

    // Store the user with the hashed password in your database
    const newUser = await User.create({ 
      email, 
      password: hashedPassword,
    avatarURL, verificationToken,
  });

      //Registration success response
    res.status(201).json({
      user:{
        email:newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
        verificationToken,
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
     // Login auth error (email)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    // Login auth error (password)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const payload = { id: user._id };
    // this generates a unique signature for our web token that only the person with the correct secret key can decode
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

     //   Login success response
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

const logoutUser = async(req,res)=>{
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
const getCurrentUser =async(req,res) =>{
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
  try {
    // access the authentication token through the req.user
    const { _id } = req.user;
    console.log("User ID:", _id); // Debug log

    // uploaded avatar is accessed through the req.file
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    // request body is the request that supports this content type: application/json, text/html
    // request file is the request that supports this content type: Content-Type: image/jpeg, multipart/form-data
    const { path: oldPath, originalname } = req.file;
    console.log("File Path:", oldPath, "Original Filename:", originalname); // Debug log

    
    
    // Move the user's avatar from the tmp folder to the public/avatars folder and give it a unique name for the specific user
    // the unique file name that we will generate is a concatenated version of the id of the user document and the extension of the original image file.

    // 66e576387fdc812acc32be53.webp
    const extension = path.extname(originalname);
    const filename = `${_id}${extension}`;
    console.log("Generated Filename:", filename); // Debug log

    // call the file system rename path function
    const newPath = path.join("public", "avatars", filename);
    // public/avatars/66e576387fdc812acc32be53.jpeg
    // await fs.rm(newPath); 

    // we are reading the image from the temporary path
    // we are resizing the image to 250px width and 250px height
    // we are saving the updated resolution to the old temporary path
    try {
      const image = await Jimp.read(oldPath)
      console.log("Resizing image"); // Debug log
      await image.resize({ w: 250, h: 250 }).write(newPath);
      console.log("Image resized and saved to:", oldPath); // Debug log
      fs.rm(oldPath)
    } catch(e) {
      console.log(e)
    }

    // construct a new avatar URL
    // this may not work directly if you are using a windows OS
    const avatarURL = path.join("/avatars", filename);

    // you may try this for a windows ecosystem
    // let avatarURL = path.join("/avatars", filename);
    // avatarURL = avatarURL.replace(/\\/g, "/");

    // save the newly generated avatar in the database and the public folder
    await User.findByIdAndUpdate(_id, { avatarURL });
    console.log("Avatar URL saved to the database"); // Debug log

    res.status(200).json({ avatarURL });
  } catch (error) {
    console.error("Error in updateAvatar:", error); // Debug log
    res.status(500).json({ message: error.message });
  }
};
const verifyEmail = async (req,res) =>{
  const {verificationToken} =req.params;
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
}


export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};


//1.validate request using joi
//2. validate if email is existing
//3.if email exist -compare or decryptthe hashedpassword to the password
//4. if decryption is sucesseful , we will generate a token to the user
//the user will apply the token as an authentication for all future request