// index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

const mongoURI = 'mongodb+srv://hirumihai:123456a@cluster0.mvjn2ju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const shiftsRoute = require('./routes/shifts');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api', shiftsRoute);
app.use('/api', userRoutes);
app.use('/api', authRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
