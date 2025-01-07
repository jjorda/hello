const express = require('express')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const port = 3005
process.title = "hello";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const transporter = nodemailer.createTransport({
  port: 465,
  host: process.env.MAIL_HOST,
  secure: true, // true for port 465, false for other ports
  auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
  },
});

app.post('/contact', (req, res) => {
  console.log(req.body);
  const { subject, text } = req.body;
  const mailData = {
      from: process.env.MAIL_USER,
      to: process.env.MAIL_TO,
      subject: subject,
      text: text,
      html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
  };

  transporter.sendMail(mailData, (error, info) => {
      if (error) {
          return console.log(error);
      }
      res.status(200).send({ message: "Mail send", message_id: info.messageId });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
