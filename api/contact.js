// api/contact.js - Serverless function to forward contact form data to WhatsApp and Gmail
// Deploy on Vercel, Netlify Functions, or any platform that supports a simple Node.js handler.
// NOTE: Store credentials in environment variables; do NOT commit them to source control.
//   - CALLMEBOT_TOKEN (optional for CallMeBot, not required for basic usage)
//   - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS (for Nodemailer SMTP)
//   - WHATSAPP_NUMBER (your WhatsApp number, e.g., 9036288956)
//   - WHATSAPP_API_URL (base URL for CallMeBot, default provided)

const nodemailer = require('nodemailer');
const https = require('https');

/** Helper to send a GET request to CallMeBot for WhatsApp messaging */
function sendWhatsAppMessage(text) {
  return new Promise((resolve, reject) => {
    const whatsappNumber = process.env.WHATSAPP_NUMBER || "9036288956";
    const baseUrl = process.env.WHATSAPP_API_URL || "https://api.callmebot.com/whatsapp.php";
    const url = `${baseUrl}?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      // CallMeBot always returns 200 even on errors, but we consider any 2xx a success
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        reject(new Error(`WhatsApp request failed with status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

/** Helper to send an email via Nodemailer */
async function sendEmail({ name, email, phone, message }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: "darshankr533@gmail.com",
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  };

  await transporter.sendMail(mailOptions);
}

/** Vercel / Netlify style handler */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { name, email, phone, message } = req.body;

  // Basic validation
  if (!name || !email || !phone || !message) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  // 1️⃣ WhatsApp via CallMeBot
  const waText = `*New Contact Form Submission*\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Message:* ${message}`;
  try {
    await sendWhatsAppMessage(waText);
  } catch (e) {
    console.error('WhatsApp error', e);
    // Continue anyway – email may still be sent
  }

  // 2️⃣ Email via Nodemailer
  try {
    await sendEmail({ name, email, phone, message });
  } catch (e) {
    console.error('Email error', e);
    res.status(500).json({ error: 'Failed to send email' });
    return;
  }

  // Respond to client
  res.status(200).json({ success: true });
};

