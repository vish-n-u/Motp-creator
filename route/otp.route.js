const otpController = require("../controller/otp.controller");

module.exports = (app) => {
  app.post("/otpGenerator/ap1/v1/otps", otpController.otpSender);
  app.post("/otpGenerator/ap1/v1/verifyOtp", otpController.verify);
};
