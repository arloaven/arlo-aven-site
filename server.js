try {
  require('dotenv').config();
} catch (error) {
  console.warn('dotenv is not installed; continuing without .env support.');
}
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});
const upload = multer({ storage });

function createEmailTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
}

async function sendOrderEmail(orderData, filePath) {
  const transporter = createEmailTransporter();
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!recipient) {
    throw new Error('Recipient email is not configured.');
  }

  const attachments = [];
  if (filePath) {
    attachments.push({ path: filePath });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: `New Arlo Aven production request from ${orderData.full_name}`,
    text: `A new production request was submitted:\n\n${JSON.stringify(orderData, null, 2)}`,
    attachments
  };

  return transporter.sendMail(mailOptions);
}

async function sendConfirmationEmail(orderData) {
  const transporter = createEmailTransporter();
  const customerEmail = orderData.email;

  if (!customerEmail) {
    throw new Error('Customer email is not available for confirmation.');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: 'Order Received',
    text: `Dear ${orderData.full_name},\n\nThank you for your order. We have successfully received it and will review it shortly.\n\nWe will contact you if any additional information is needed.\n\nBest regards,\nArlo Aven`
  };

  return transporter.sendMail(mailOptions);
}

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  console.log('New subscription:', email);

  return res.json({ message: 'Thank you! Your email has been received.' });
});

app.post('/api/orders', upload.single('reference_file'), async (req, res) => {
  const data = req.body;
  const file = req.file;

  if (!data.full_name || !data.email || !data.product_type || !data.service_needed) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  console.log('Order request received:', data);
  if (file) {
    console.log('Uploaded file:', file.path);
  }

  try {
    await sendOrderEmail(data, file ? file.path : null);
    await sendConfirmationEmail(data);
  } catch (error) {
    console.error('Email send failure:', error);
    return res.status(500).json({
      message: 'Your request was received, but the email notification failed. Please contact us directly.'
    });
  }

  return res.json({
    message: 'Your production request has been received. We will contact you soon.'
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
