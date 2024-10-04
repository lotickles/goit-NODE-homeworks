import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

const authenticateToken = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const [bearer, token] = authorization.split(" ");

  // Check if the bearer token is provided and valid
  if (bearer !== "Bearer" || !token) {
    console.log("Invalid authorization format or missing token");
    return res.status(401).json({ message: "Not authorized" }); // Early return to prevent further execution
  }

  try {
    console.log("Verifying token...");
    // Verify the token
    const { id } = jwt.verify(token, SECRET_KEY);
    console.log("Token verified, user ID:", id);

    // Find the user by ID and check if token matches
    const user = await User.findById(id);
    if (!user || user.token !== token || !user.token) {
      console.log("User not found or token mismatch");
      return res.status(401).json({ message: "Not authorized" }); // Early return to prevent further execution
    }

    // Attach the user to the request object and continue
    req.user = user;
    console.log("User authenticated successfully:", user.email);
    next(); // Only call next() if no response has been sent
  } catch (err) {
    console.log("Error verifying token:", err.message);
    // Handle any token verification errors
    return res.status(401).json({ message: "Not authorized" }); // Early return to prevent further execution
  }
};

export { authenticateToken };
