exports.register = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'User registered successfully (placeholder)' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    res.status(200).json({ token: 'dummy_token' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({ user: { id: 1, username: 'testuser' } });
  } catch (error) {
    next(error);
  }
};
