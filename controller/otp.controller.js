const transporter = require("../config/smtp.config");
const otpModel = require("../model/otp.model");
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } =  require("../util/sesClient");



const createSendEmailCommand = (fromAddress,toAddress,  body) => {
  console.log("body in createSendEmailCommand",body)
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT",
      },
    },
    Source: fromAddress,
  });
};

const run = async ( from,to, body) => {
  console.log("run",body)
  const sendEmailCommand = createSendEmailCommand(from,to,  body);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    if (error.name === "MessageRejected") {
      console.error("Message Rejected:", error);
      return error;
    }
    throw error;
  }
};

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
  await  run("foodDelivery@rapidosh.in",req.body.to,OTP)
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
