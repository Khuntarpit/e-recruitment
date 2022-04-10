var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  ignoreTLS: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = (email, subject, password) => {

  const html = `<div style="min-width: 100%; box-shadow: 5px 10px #888888; border-radius: 10px; padding: 10px 0; text-align: center; background: lightblue">
  <h4>Your new password has been generated.</h4><br>
  <div style="text-align: center">
    <b style="text-align: left">email</b>: ${email} <br>
    <b style="text-align: left">password</b>: ${password}
  </div>
  </div>`;

  var mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: subject,
    html: html,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendMail;
