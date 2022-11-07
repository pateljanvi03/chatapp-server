const { port, env } = require("./config/vars");
const logger = require("./config/logger");
const mongoose = require("./config/mongoose");
const { server } = require("./config/express");

// open mongoose connection
mongoose.connect();

// listen to requests
server.listen(port, () =>
  logger.info(`server started on port ${port} (${env})`)
);

/**
 * Exports express
 * @public
 */
module.exports = server;
