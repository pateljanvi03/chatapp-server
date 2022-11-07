const mongoose = require("mongoose");

const Message = new mongoose.Schema(
  {
    body: {
      type: String,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    senderUserId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    // toJSON: {
    //   virtuals: true,
    // },
    // toObject: {
    //   virtuals: true,
    // },
  }
);

// Book.virtual("category", {
//   ref: "Category",
//   localField: "categoryId",
//   foreignField: "_id",
//   justOne: true,
// });

Message.statics = {
  list(filterQuery) {
    const options = {};
    if (filterQuery.conversationId) {
      options.conversationId = filterQuery.conversationId;
    }
    // if (filterQuery.body) {
    //   options.body = { $regex: filterQuery.body };
    // }

    const page = parseInt(filterQuery.page) || 1;
    const limit = parseInt(filterQuery.limit) || 5;

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);
  },
};

module.exports = mongoose.model("Message", Message);
