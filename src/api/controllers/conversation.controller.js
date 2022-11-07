const { lte } = require("lodash");
const Conversation = require("../models/conversation.model");

exports.get = async (req, res, next) => {
  try {
    return res.json({ conversation: req.conversation });
  } catch (error) {
    return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let query = req.query;
    query.userId = req.authUserId;
    const conversations = await Conversation.list(query).populate(
      "user",
      "name"
    );

    return res.json({ conversations });
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const users = [req.authUserId, req.body.userId];
    if ((await Conversation.findOne({ users: { $all: users } })) == null) {
      const conversation = await Conversation.create({
        users,
      });
      return res.json({ conversation });
    }
  } catch (error) {
    return next(error);
  }
};
