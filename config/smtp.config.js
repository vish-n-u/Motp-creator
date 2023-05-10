const nodeMailer = require("nodemailer");

let transporter = nodeMailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  service: "outlook", // service name
  secureConnection: false,
  tls: {
    ciphers: "SSLv3", // tls version
  },
  port: 587,

  // true for 465, false for other ports
  auth: {
    user: "rapidosh77@outlook.com", // generated gmail user
    pass: process.env.password, // generated gmail password ucqgmgynzlirehxj
  },
});

module.exports = transporter;
