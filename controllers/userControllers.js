const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    data: 'This route has not been implemented yet',
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    data: 'This route has not been implemented yet',
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    data: 'This route has not been implemented yet',
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    data: 'This route has not been implemented yet',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'fail',
    data: 'This route has not been implemented yet',
  });
});
