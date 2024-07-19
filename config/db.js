const mongoose = require('mongoose');

const uri = 'mongodb+srv://hoalacanh2508:FnXN4Z9PhHQdRbcv@cluster0.xdbxkit.mongodb.net/AND103';

const connect = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

module.exports = { connect };
