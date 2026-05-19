import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import axios from 'axios';
import { Resend } from 'resend';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// --- API ROUTES ---

// 1. Paystack Integration
app.post('/api/payments/initialize', async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Paystack uses kobo
        metadata,
        callback_url: `${process.env.APP_URL}/payment/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Paystack error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// 2. Email Integration (Resend)
app.post('/api/email/send', async (req, res) => {
  if (!resend) return res.status(500).json({ error: 'Email service not configured' });
  try {
    const { to, subject, html } = req.body;
    const { data, error } = await resend.emails.send({
      from: 'HELPP <notifications@helpp.org>',
      to: [to],
      subject,
      html,
    });
    if (error) throw error;
    res.json({ status: 'sent', data });
  } catch (error: any) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Email failed to send' });
  }
});

// 3. WhatsApp Cloud API Integration
app.post('/api/whatsapp/send', async (req, res) => {
  const { to, message } = req.body;
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.PHONE_NUMBER_ID;
  if (!token || !phoneId) return res.status(500).json({ error: 'WhatsApp not configured' });

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('WhatsApp error:', error.response?.data || error.message);
    res.status(500).json({ error: 'WhatsApp message failed' });
  }
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  const PORT = 3000;
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
