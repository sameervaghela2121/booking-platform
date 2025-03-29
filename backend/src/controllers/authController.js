const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendVerificationEmail } = require('../utils/email');

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log('Signup request received:', { firstName, lastName, email });

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    console.log('Existing user check:', existingUser);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const { id, verificationToken } = await User.create(firstName, lastName, email, password);
    console.log('User created:', { id, verificationToken });

    // For testing purposes, auto-verify the user
    await User.verifyEmail(verificationToken);
    console.log('User auto-verified for testing');

    // Try to send verification email, but don't fail if it doesn't work
    try {
      await sendVerificationEmail(email, verificationToken);
      console.log('Verification email sent');
    } catch (emailError) {
      console.warn('Could not send verification email:', emailError.message);
    }

    res.status(201).json({
      message: 'User created successfully. For testing purposes, your account is automatically verified.',
      userId: id
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log('Verifying email with token:', token);
    
    const success = await User.verifyEmail(token);
    console.log('Verification result:', success);
    
    if (success) {
      res.json({ message: 'Email verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid verification token' });
    }
  } catch (error) {
    console.error('Error in email verification:', error);
    res.status(500).json({ error: 'Error verifying email' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};
