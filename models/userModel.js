const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username."],
      unique: true,
      minlength: [3, "Username must contained at least 3 characters."],
      maxlength: [15, "The max length for username is 15 characters."],
    },
    firstName: {
      type: String,
      required: [true, "Please provide a name."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name."],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an email."],
      validate: [validator.isEmail, "Please provide a valid email."],
      lowercase: true,
      trim: true,
    },
    affiliation: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    entries: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Colourant",
      },
    ],

    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: [5, "The password must contain at least 5 characters."],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same, please try again.",
      },
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// userSchema.virtual("contributor", {
//   ref: "Colourant",
//   foreignField: "contributor",
//   localField: "_id",
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.isPassChangedAfterToken = function (jwtTimestamp) {
  if (!this.passwordChangeAt) return;
  const passTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
  return passTimestamp > jwtTimestamp;
};
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
