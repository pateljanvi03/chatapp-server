const httpStatus = require("http-status");
const { omit } = require("lodash");
const User = require("../models/user.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json({ user: savedUser.transform() });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const ommitId = "_id";
    const updatedUser = omit(req.body, ommitId);

    const savedUser = await req.user.updateOne(updatedUser);
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query;
    console.log(req.authUserId);
    query.excludeUserId = req.authUserId;
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    res.json({ users: transformedUsers });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    await req.user.delete();
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};
