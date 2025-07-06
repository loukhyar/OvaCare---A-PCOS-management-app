require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

let otps = {}; // Store OTPs temporarily

// Generate OTP
function generateOTP() {
  return crypto.randomBytes(3).toString('hex'); // Generates a random 6-character string
}

// Send OTP endpoint
app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otps[email] = otp;

  // Configure nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email options
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ success: true });
    }
  });
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otps[email] && otps[email] === otp) {
    delete otps[email]; // OTP verified, remove it
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
