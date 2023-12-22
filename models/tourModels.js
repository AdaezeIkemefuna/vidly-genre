const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, 'A tour name must be unique.'],
      required: [true, 'A tour must have a name.'],
      maxLength: [40, 'Tour name must be less than or equal to 40 characters'],
      minLength: [10, 'Tour name must be more than or equal to 10 characters'],
      trim: true,
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Rating cannot exceed 5'],
      min: [1, 'Rating cannot be less than 1'],
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
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price discount should be less than price.',
      },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual Properties - Properties you don't want saved to the database
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document middlewares - For manipulating documents during creation. Works on .save() and .create() only
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.post('save', function (doc, next) {
  console.log(doc, 'saved');
  next();
});

//Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(Date.now() - this.start, 'milliseconds');
  next();
});

//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
