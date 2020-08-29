const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  name: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  address: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Gruop',
    required: true,
    default: '_Other',
  },
});

const Point = mongoose.model('Point', pointSchema);

module.exports = Point;
