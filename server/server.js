import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Store OTPs in memory (for development purposes)
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Mnotify
const sendOTP = async (phoneNumber, otp) => {
  try {
    const message = `Your verification code is: ${otp}. The code expires in 60 seconds`;
    const url = `https://api.mnotify.com/api/sms/quick?key=${process.env.MNOTIFY_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: [phoneNumber],
        sender: 'DigiPay',
        message,
        is_schedule: "false",
        schedule_date: ""
      })
    });

    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

// Request OTP
app.post('/api/request-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  try {
    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 60 * 1000; // OTP expires in 60 seconds

    // Store OTP with expiration
    otpStore.set(phoneNumber, {
      otp,
      expiresAt
    });

    // Send OTP via Mnotify
    const sent = await sendOTP(phoneNumber, otp);
    
    if (sent) {
      res.json({ success: true, message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error in request-otp:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const storedData = otpStore.get(phoneNumber);
    
    if (!storedData) {
      return res.status(400).json({ success: false, message: 'No OTP found for this number' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    if (storedData.otp === otp) {
      otpStore.delete(phoneNumber);
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error in verify-otp:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 