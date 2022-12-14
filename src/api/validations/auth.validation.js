const Joi = require("joi");

module.exports = {
  // POST /v1/auth/register
  register: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required().max(128),
    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
};
