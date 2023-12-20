const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    unique: [true, 'A tour name must be unique.'],
    required: [true, 'A tour must have a name.'],
    trim: true,
  },

  duration: {
    type: Number,
    required: [true, 'A tour must have a duration.'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size.'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty.'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price.'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true, //gets rid of whitespace
    required: [true, 'A tour must have a summary.'],
  },
  description: {
    type: String,
    trim: true, //gets rid of whitespace
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image.'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, //to hide it from the client.
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
