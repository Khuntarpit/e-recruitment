const nodemailer = require('nodemailer');
const EmailTemplates = require('swig-email-templates');
const config = require('../../config/config');
const sgMail = require('@sendgrid/mail');
const { env } = require("process");
sgMail.setApiKey(process.env.API_KEY);


async function sendMail(email, subjectName, mailTemplateName, mailData) {
  return new Promise(async (resolve, reject) => {
    const msg = {
        from: process.env.adminEmail,
        to: ["dev011.rejoice@gmail.com",user.email],
        subject: 'Hello from send grid',
        text: 'this is the first test mail from sendgrid',
        html: '<h1>Here is the password.</h1>' + user.password
    }
    sgMail
        .send(msg)
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            console.log(err);
          reject("Send mail error ", err);
        });
         
  })
};



module.exports = {
  sendMail
};
