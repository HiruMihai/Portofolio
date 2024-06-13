// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/auth');
const bcrypt = require('bcrypt');


router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  const { email, firstName, lastName, birthDate } = req.body;
  const userId = req.userId;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { email, firstName, lastName, birthDate }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

router.delete('/profile', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.post('/profile/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err.message);
    res.status(500).json({ error: 'Failed to change password' });
  }
});


module.exports = router;
