// Mock auth middleware for demonstration
exports.protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  // In a real app, you would verify the JWT here.
  // For this scaffold, we just extract the user ID from the token if possible, or mock it.
  try {
    // If the token is "dummy_token" from login, we mock a user id 1
    req.user = { id: 1, username: 'testuser' };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
