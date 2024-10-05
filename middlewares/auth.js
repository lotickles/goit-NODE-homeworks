import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

const authenticateToken = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  // Check if the bearer token is provided and valid
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not authorized: Invalid token format" });
  }

  try {
    // Verify the token
    const { id } = jwt.verify(token, SECRET_KEY);

    // Find the user by ID and check if token matches
    const user = await User.findById(id);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized: Token mismatch" });
    }

    // Attach the user to the request object and continue
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized: Token verification failed" });
  }
};

export { authenticateToken };
