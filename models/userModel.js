const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    maxLength: [40, "Name cannot exceed 40 characters"],
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "An email must be unique"],
    required: [true, "An email is required"],
    minLength: [8, "Email must be up to 8 characters"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "A password is required"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm password is required"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "It doesn't match password",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  //FALSE MEANS NOT CHANGED
  return false;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
