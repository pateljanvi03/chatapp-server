const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");
const APIError = require("../errors/api-error");
const { env, jwtSecret, jwtExpirationInterval } = require("../../config/vars");

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      // minlength: 3,
      maxlength: 128,
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    profile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    const rounds = env === "test" ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ["_id", "name", "username", "createdAt"];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const payload = {
      exp: dayjs().add(jwtExpirationInterval, "minutes").unix(),
      iat: dayjs().unix(),
      sub: this._id,
    };
    return jwt.sign(payload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: "User does not exist",
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { username, password, refreshObject } = options;
    if (!username) {
      throw new APIError({
        message: "A Username is required to generate a token",
      });
    }

    const user = await this.findOne({ username }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = "Incorrect username or password";
    } else if (refreshObject && refreshObject.username === username) {
      if (dayjs(refreshObject.expires).isBefore()) {
        err.message = "Invalid refresh token.";
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = "Incorrect username or refreshToken";
    }
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list(filterQuery) {
    const options = {};

    if (filterQuery.name) {
      options.name = { $regex: filterQuery.name };
    }
    if (filterQuery.username) {
      options.username = { $regex: filterQuery.username };
    }
    if (filterQuery.excludeUserId) {
      options._id = { $ne: filterQuery.excludeUserId };
    }
    const page = parseInt(filterQuery.page) || 1;
    const limit = parseInt(filterQuery.limit) || 5;

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
