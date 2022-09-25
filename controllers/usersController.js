const User = require("../models/userModel");

exports.updateMyAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.email = req.body.email;
    user.username = req.body.username;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.affiliation = req.body.affiliation;
    const updatedUser = await user.save({ runValidators: true });

    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
