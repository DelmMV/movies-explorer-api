require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");

const router = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { centralizedHandleError } = require("./errors/centralizedHandleError");
const {
  DEV_DATA_BASE_PATH,
  DEV_BASE_PATH,
  DEV_PORT,
} = require("./utils/devconfig");
const { corsOption } = require("./utils/corsOption");
const { limiter } = require("./utils/limitter");

const { NODE_ENV, DATA_BASE_PATH, PORT, BASE_PATH } = process.env;

const app = express();
app.use(cors(corsOption));
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(centralizedHandleError);

async function main() {
  await mongoose.connect(
    NODE_ENV === "production" ? DATA_BASE_PATH : DEV_DATA_BASE_PATH,
    { useNewUrlParser: true }
  );
  console.log("Connected to db");
  await app.listen(NODE_ENV === "production" ? PORT : DEV_PORT, () => {
    console.log(
      `App listening on port ${NODE_ENV === "production" ? PORT : DEV_PORT}`
    );
    console.log(
      NODE_ENV === "production" ? `${BASE_PATH}:${PORT}` : DEV_BASE_PATH
    );
  });
}

main();
