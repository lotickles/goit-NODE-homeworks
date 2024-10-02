import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if the token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user by the id from the decoded token
    const user = await User.findById(decoded.id);

    if (!user || user.token !== token) {
      // If the user doesn't exist or the token doesn't match, return unauthorized error
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Attach user to request object for use in the route
    req.user = user;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

export default authMiddleware;
