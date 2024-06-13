// routes/shifts.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Shift = require('../models/shift');

router.get('/shifts', verifyToken, async (req, res) => {
  try {
    const shifts = await Shift.find({ userId: req.userId });
    res.status(200).json(shifts);
  } catch (err) {
    console.error('Error fetching shifts:', err.message);
    res.status(500).json({ error: 'Failed to fetch shifts' });
  }
});


router.get('/shifts/:id', verifyToken, async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) return res.status(404).json({ error: 'Shift not found' });
    res.status(200).json(shift);
  } catch (err) {
    console.error('Error fetching shift:', err.message);
    res.status(500).json({ error: 'Failed to fetch shift' });
  }
});

router.put('/shifts/:id', verifyToken, async (req, res) => {
  try {
    const updatedShift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedShift) return res.status(404).json({ error: 'Shift not found' });
    res.status(200).json(updatedShift);
  } catch (err) {
    console.error('Error updating shift:', err.message);
    res.status(500).json({ error: 'Failed to update shift' });
  }
});

router.delete('/shifts/:id', verifyToken, async (req, res) => {
  try {
    const deletedShift = await Shift.findByIdAndDelete(req.params.id);
    if (!deletedShift) return res.status(404).json({ error: 'Shift not found' });
    res.status(200).json({ message: 'Shift deleted' });
  } catch (err) {
    console.error('Error deleting shift:', err.message);
    res.status(500).json({ error: 'Failed to delete shift' });
  }
});

router.post('/addShift', verifyToken, async (req, res) => {
  const { date, start, end, wage, workplace, name, comments } = req.body;

  try {
    const newShift = new Shift({
      userId: req.userId,
      date,
      start,
      end,
      wage,
      workplace,
      name,
      comments
    });

    const savedShift = await newShift.save();
    res.status(201).json(savedShift);
  } catch (err) {
    console.error('Error adding shift:', err.message);
    res.status(500).json({ error: 'Failed to add shift' });
  }
});

module.exports = router;
