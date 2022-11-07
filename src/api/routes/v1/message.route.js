const express = require("express");
const validate = require("express-validation");
const { list, create, get } = require("../../controllers/message.controller");
const { LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router.use(LOGGED_USER);

router.route("/").get(list).post(create);

router.route("/:conversationId").get(get);

module.exports = router;
