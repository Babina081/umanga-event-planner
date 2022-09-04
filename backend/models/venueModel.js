const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter you venue name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please Enter venue Category'],
  },

  address: {
    type: String,
    required: [true, 'Please enter the address'],
  },

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

  // description: {
  //   type: String,
  //   required: true,
  // },

  maxGuests: {
    type: Number,
    required: [true, 'Please Enter Venue Max Guests'],
    maxlength: [4, 'Max Guests cannot exceed 4 character'],
    default: 1,
  },

  price: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Venue', venueSchema);
