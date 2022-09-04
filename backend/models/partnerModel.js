const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Partner Name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please Enter Partner Description'],
  },
  role: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        require: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Partner', partnerSchema);
