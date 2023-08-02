const Tour = require('../model/toursModel');
const ErrorHandle = require('../utils/apiErrorHandler');

exports.createATour = async (req, res, next) => {
  try {
    const doc = await Tour.create(req.body);

    if (!doc) return new ErrorHandle(`There is no such tour`, 404);

    res.status(200).json({
      message: 'success',
      doc,
    });
  } catch (error) {
    return next(new ErrorHandle(`${error.message}`, 404));
  }
};
