const transporter = require("../config/smtp.config");
const otpModel = require("../model/otp.model");

exports.otpSender = async (req, res) => {
  console.log("-------Starting new otp sending--------", req.body.to, req.body);
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }

  console.log("-------Starting new otp sending--------", OTP, req.body.to);
  let obj = {
    otp: OTP,
    email: req.body.to,
  };

  try {
    let oldOtp = await otpModel.deleteOne({ email: req.body.to });
    console.log("oldOtp---", oldOtp);

    let newOtp = await otpModel.create({ otp: OTP, email: req.body.to });
    console.log("newOtp", newOtp);
    transporter.sendMail({
      // fnder addressrom: "", // se\
      from: req.body.from || "rapidosh77@outlook.com",
      to: req.body.to, // list of receivers
      subject: req.body.subject || "Otp from my app", // Subject lin
      text: OTP, // plain text body
    });
    res.status(200).send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

exports.verify = async (req, res) => {
  console.log("-----------Verify Otp------------", req.body);
  try {
    const doesOtpExists = await otpModel.findOne({
      email: req.body.email,
    });
    console.log("doesOtpExists;", doesOtpExists);
    if (!doesOtpExists) return res.status(400).send({ message: "Invalid" });
    else {
      if (req.body.otp != doesOtpExists.otp) {
        return res.status(400).send({ message: "Invalid" });
      } else {
        let x = await otpModel.findOne({
          where: {
            email: req.body.email,
          },
        });
        console.log("====", doesOtpExists == x);
        return res.status(200).send("Success  ");
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server err...");
  }
};
