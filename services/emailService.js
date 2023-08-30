const nodemailer= require('nodemailer')
const ejs = require("ejs");
const path = require('path')
const emailTemplatePath = './view/emailtemplate.ejs';
const {format} = require('../handler/errorHandler')
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASSWORD 
    }

  });

const emailSend =async (to,token,next)=>{
  transporter.sendMail({
    from: `${process.env.EMAIL}`,
      to: to,
      subject: 'Email Verification',
      html: await ejs.renderFile(emailTemplatePath, {
        verificationLink: `${process.env.WEBSITE_LINK}/users/verify?token=${token}`
      })
    }, (error, info) => {
      if (error) {
          throw format(error.message,500)
        } 
        console.log('Verification email sent:', info.response);
        return ;
      });
}

module.exports = {
    emailSend
}