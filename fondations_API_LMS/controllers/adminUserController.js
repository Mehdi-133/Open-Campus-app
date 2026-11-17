const bcrypt = require("bcrypt");
const User = require("../models/User");

const ADMIN_USER_FIELDS = "name email role status";
const SALT_ROUNDS = 10;

// Maps a created document to the same account summary used by listUsers.
// The password hash is never returned.
const toAccountSummary = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select(ADMIN_USER_FIELDS)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    const data = users.map(toAccountSummary);

    return res.status(200).json({
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Admin-only account creation. Validation runs in the route middleware, so by
// this point role and status carry their defaults. A duplicate e-mail is a
// deterministic 409, matching the register flow and the shared error contract.
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    return res.status(201).json({
      status: 201,
      message: "Account created successfully",
      data: toAccountSummary(user),
    });
  } catch (error) {
    next(error);
  }
};

// Admin-only account update. Validation runs in the route middleware, so only
// the four allow-listed fields can reach here. The password hash is never read
// or rewritten. A duplicate e-mail (other than the account's own) is a
// deterministic 409 and a missing account is a 404, both in the shared envelope.
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(id).select(ADMIN_USER_FIELDS);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (Object.prototype.hasOwnProperty.call(updates, "email")) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        return next(error);
      }
    }

    for (const field of ["name", "email", "role", "status"]) {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        user[field] = updates[field];
      }
    }

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Account updated successfully",
      data: toAccountSummary(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  createUser,
  updateUser,
};
