require('dotenv').config();
const EmailTemplates = require('swig-email-templates');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.API_KEY);

const templates = new EmailTemplates({
  root: 'server/views/emailers/',
  swig: {
    cache: false
  }
});

async function sendMail(email, subjectName, mailTemplateName, mailData) {
  return new Promise(async (resolve, reject) => {
    templates.render(mailTemplateName, mailData, async (err, html) => {
      if (err) {
        // return new Error(err);
        reject(err);
      }
      else {
        const msg = {
          from: `Home-Dine <${process.env.adminEmail}>`,
          to: [email],
          subject: subjectName,
          html
        }
        sgMail
          .send(msg)
          .then((res) => {
            console.log("res",res);
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            reject("Send mail error ", err);
          });


      }
    });
  })
};



module.exports = {
  sendMail
};
