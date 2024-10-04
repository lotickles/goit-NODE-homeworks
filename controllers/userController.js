
import {signupValidation,subscriptionValidation} from "../validation/validation.js"
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import {User} from "../models/usersModel.js";

const {SECRET_KEY} = process.env;
// Sign up User
const signupUser =async(req,res)=>{
  const {error} = signupValidation.validate(req.body);

  //Registration validation error
  if(error){
    res.status(400).json({message: "Missing required email or password fields"});
  }
  try {
    const {email,password} = req.body
    const userExists = await User.findOne({email});

  //Registration conflict error
    if(userExists){
      return res.status(409).json({message: "Email in use"});
    }
    // Hash the password
    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

  
    // Store the user with the hashed password in your database
    const newUser = await User.create({ email, password: hashedPassword });

      //Registration success response
    res.status(201).json({
      user:{
        email:newUser.email,
        subscription: newUser.subscription,
        // password: newUser.password, // Optional, not recommended for security reasons
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
};
//loginuser


const loginUser = async(req,res)=>{
  const {error} = signupValidation.validate(req.body);

  //Validation error
  if(error){
    res.status(400).json({message: "Missing required email or password fields"});
  }
  try{
    const {email,password} = req.body;
    const userExists = await User.findOne({email});

  // Find the user by email
    if(!userExists){
      return res.status(401).json({message: "Email or Password is wrong"});
    }
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials,Click forgot password to reset", });
    }
    // Generate a token
    //_id is coming from MongoDb Compass
    //id is from JWT
    const payload = {id: userExists._id, email}
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

    await User.findByIdAndUpdate(userExists._id, { token });

    res.status(200).json({
    token, // Return the token to the client
      user: {
        email: userExists.email, // Include the user's email in the response
      },
        subscription: userExists.subscription,
    });

  } catch {error}{
    console.error(error);
    res.status(500).json({message: "Server error"});
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
// MVC Architecture
export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserSubscription,
};

//1.validate request using joi
//2. validate if email is existing
//3.if email exist -compare or decryptthe hashedpassword to the password
//4. if decryption is sucesseful , we will generate a token to the user
//the user will apply the token as an authentication for all future request