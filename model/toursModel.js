const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      require: true,
    },
    description: {
      type: String,
      trim: true,
    },
    maxGroupSize: {
      type: Number,
      maxLength: [40, 'only 40 people are allowed in the trip'],
      minLength: [1, 'input error'],
    },
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);

//indexing for data that is need at an inst
tourSchema.index({price: 1});
tourSchema.index({startLocation: '2dsphere'});

//Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'reviewedTour',
  localField: '_id',
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
