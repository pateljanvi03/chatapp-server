const Joi = require("joi");

module.exports = {
  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
    },
  },

  // POST /v1/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().max(128),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().max(128),
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
