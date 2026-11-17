const User = require("../models/User");

const ADMIN_USER_FIELDS = "name email role status";

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select(ADMIN_USER_FIELDS)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    const data = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }));

    return res.status(200).json({
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
};
