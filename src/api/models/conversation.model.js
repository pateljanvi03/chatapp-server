const { json } = require("express");
const { number, optional } = require("joi");
const mongoose = require("mongoose");

const Conversation = new mongoose.Schema(
  {
    lastMessageBody: {
      type: String,
    },
    lastMessageBodyLowerCase: {
      type: String,
    },
    users: {
      required: true,
      type: mongoose.Schema.Types.Array,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

Conversation.virtual("user", {
  ref: "User",
  localField: "users",
  foreignField: "_id",
});

Conversation.statics = {
  list(filterQuery) {
    const options = {};
    if (filterQuery.userId) {
      options.users = filterQuery.userId;
    }

    const page = parseInt(filterQuery.page) || 1;
    const limit = parseInt(filterQuery.limit) || 5;
    return this.find(options)
      .sort({ updatedAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);
  },
};

module.exports = mongoose.model("Conversation", Conversation);
