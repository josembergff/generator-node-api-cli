const lodash = require("lodash");
const cron = require("node-cron");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const momenttz = require("moment-timezone");
const https = require("https");
const { check, validationResult } = require("express-validator/check");
const useragent = require("useragent");
const md5 = require("md5");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const parameters = require("./parameters");

moment.locale("en-au");

const transporter = nodemailer.createTransport({
  host: parameters.emailSMTP,
  port: parameters.emailPorta,
  secure: parameters.emailSeguro, // true for 465, false for other ports
  auth: {
    user: parameters.emailUsuario,
    pass: parameters.emailSenha
  }
});

module.exports = {
  lodash: lodash,
  cron: cron,
  jwt: jwt,
  moment: moment,
  momenttz: momenttz,
  https: https,
  validation: { check: check, validationResult: validationResult },
  useragent: useragent,
  md5: md5,
  generator: generator,
  nodemailer: transporter,
  mongoose: mongoose
};
