const mongoose = require('mongoose');

const decorationSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Please Enter Decoration Price'],
    maxlength: [8, 'Price cannot exceed 8 characters'],
  },
  // ratings: {
  //   type: Number,
  //   default: 0,
  // },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please Enter Decoration Category'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Decoration', decorationSchema);
