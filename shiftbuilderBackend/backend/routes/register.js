// routes/register.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName, birthDate } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword, firstName, lastName, birthDate });

        const savedUser = await newUser.save();

        const token = jwt.sign({ userId: savedUser._id }, 'your_secret_key', { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error('Error during user registration:', err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
