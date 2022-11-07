const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const { emit } = require("../../config/socket");

exports.list = async (req, res, next) => {
  try {
    const messages = await Message.list(req.query);
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.query.conversationId,
    });
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body;
    let trimedMessageBody = req.body.body.slice(0, 50);
    body.senderUserId = req.authUserId;
    const message = await Message.create(body);
    await Conversation.updateOne(
      { _id: req.body.conversationId },
      {
        lastMessageBody: trimedMessageBody,
        lastMessageBodyLowerCase: trimedMessageBody.toLowerCase(),
      }
    );
    const conversation = await Conversation.findOne({
      _id: req.body.conversationId,
    }).populate("user", "name");

    for (let userId of conversation.users) {
      emit("conversation_" + userId, conversation);
      emit("new-conversation-message" + userId, message);
    }

    return res.json({ message });
  } catch (error) {
    return next(error);
  }
};
