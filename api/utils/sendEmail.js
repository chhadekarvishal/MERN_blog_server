require("dotenv").config();
const mailgun = require("mailgun-js");

const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_API_KEY;

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

const sendEmail = (options) => {
  const data = {
    from: "EZZY Blogs <no-reply@sandboxba634c52001349b29cf1031062b35b6a.mailgun.org>",
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  console.log("MAIL: ", data);
  return new Promise((resolve, reject) => {
    mg.messages().send(data, function (error, body) {
      if (error) {
        return reject(error);
      }
      resolve(body);
    });
  });
};

module.exports = sendEmail;
