// server.js - simple Express server to serve the portfolio and handle the contact endpoint
require('dotenv').config();
const express = require('express');
const path = require('path');
const contactHandler = require('./api/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (required for our fetch POST)
app.use(express.json());

// Serve static files (HTML, CSS, JS, images, videos)
app.use(express.static(path.join(__dirname)));

// Contact endpoint
app.post('/api/contact', contactHandler);

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
