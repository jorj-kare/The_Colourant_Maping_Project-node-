const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id.toHexString());
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;
  res.cookie("jwt", token, cookiesOptions);
  user.password = undefined;
  res.status(statusCode).json({ status: "success", token, data: { user } });
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      email: req.body.email,
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      affiliation: req.body.affiliation,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return next(
        new CustomError("You must provide username and password.", 404)
      );
    const user = await User.findOne({ username }).select("+password");

    if (!user || !(await user.isPasswordCorrect(password, user.password)))
      return next(
        new CustomError(
          "Incorrect password or username, please try again.",
          404
        )
      );
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "logged-out", {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 1000),
    });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("Access only to administrator.", 403));
    }
    next();
  };

exports.restrict = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.startWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(
        new CustomError("You are not login, please login to continue.", 401)
      );
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id).populate({
      path: "entries",
      select: "-__v -contributor ",
    });
    if (!currentUser) {
      return new CustomError(
        `The user that this token belongs doesn't exist anymore.`,
        400
      );
    }
    if (currentUser.isPassChangedAfterToken(decoded.iat)) {
      return new CustomError(
        "User recently changed password, please login again.",
        401
      );
    }
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new CustomError(`There is no user with ${email} email address.`, 404)
      );
    }
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `https://${req.get(
      "host"
    )}/resetPassword?token=${resetToken}`;

    const message = `Forgot your password? Fill the form  with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forgot your password please ignore this email.`;
    try {
      sendEmail({
        email: user.email,
        subject: "Your password reset token (Valid for 10 minutes)",
        message,
      });
      res.status(200).json({
        status: "success",
        message: "The password reset token has send to your email.",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({ validateBeforeSave: false });
      return next(
        new CustomError(
          "There was an error sending the email, please try again.",
          500
        )
      );
    }
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user)
      return next(new CustomError("Token is invalid or has expired.", 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message:
        "Your password was successfully changed, now you can login with your new password.",
    });
  } catch (err) {
    next(err);
  }
};
exports.isTokenValid = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token)
      return next(
        new CustomError("Something went wrong please try again.", 404)
      );
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user)
      return next(new CustomError("Token is invalid or has expired.", 400));
    res.status(200).json({
      status: "success",
      userId: user.id,
    });
  } catch (err) {
    next(err);
  }
};
exports.updateMyPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (
      !(await user.isPasswordCorrect(req.body.currentPassword, user.password))
    ) {
      return next(
        new CustomError(
          "Your current password is not correct, please try again.",
          401
        )
      );
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save({ validateBeforeSave: true });

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
exports.isUserLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      // Check if user still exit
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();
      // Check if user changed password after the token was issued
      if (currentUser.isPassChangedAfterToken(decoded.iat)) return next();
      // There is a user
      req.user = currentUser;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
