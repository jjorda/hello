const express = require('express')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require("cors");

require('dotenv').config()

const app = express()
var corsOptions = {
  origin: ["https://play.monjour.es","https://monjour.es"],
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const port = process.env.PORT || 3005;
process.title = "hello";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const transporter = nodemailer.createTransport({
  port: process.env.MAIL_PORT,
  host: process.env.MAIL_HOST,
  secure: process.env.MAIL_SECURE,
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
    html: text,
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
