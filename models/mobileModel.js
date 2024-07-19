const mongoose = require('mongoose');

const MobileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  born: {
    type: Number
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String // Lưu tên file ảnh
  }
});

const MobileModel = mongoose.model('Mobile', MobileSchema);

module.exports = MobileModel;
