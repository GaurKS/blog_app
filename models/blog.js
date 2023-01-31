const mongoose = require('mongoose');

// blog schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    max: 40
  },
  createdBy: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  description: {
    type: String,
    required: true,
  },
  tags: [{
    type: String
  }],
  email: {
    type: String,
    required: true
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);