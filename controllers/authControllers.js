const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  res.status(201).json({
    status: "success",
    createdAt: req.requestTime,
    token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email or password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  res.status(201).json({
    status: "success",
    token,
    createdAt: req.requestTime,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You're not authourized to use use this application, Please log in",
        401
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  //IF user is deleted
  if (!currentUser) {
    return next(
      new AppError(
        "The user belogning to this token no longer exists, please log in again.",
        401
      )
    );
  }

  //If user recently changed password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "This user recently change password, please log in again.",
        401
      )
    );
  }

  //GRant access
  req.user = currentUser;
  next();
});
