import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import https from 'https';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); 

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;

// Send OTP endpoint
app.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  const options = {
    method: 'POST',
    hostname: 'control.msg91.com',
    path: `/api/v5/otp?otp_expiry=600&template_id=&mobile=${phone}&authkey=${MSG91_AUTH_KEY}&realTimeResponse=1`,
    headers: {
      'Content-Type': 'application/JSON',
    },
  };

  const request = https.request(options, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const body = Buffer.concat(chunks);
      const responseData = JSON.parse(body.toString());
      if (responseData.type === 'success') {
        res.status(200).json({ success: true, message: 'OTP sent successfully', data: responseData });
      } else {
        res.status(400).json({ success: false, message: responseData.message });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ success: false, message: error.message });
  });

  request.write(JSON.stringify({ mobile: phone, otp_length: 6, sender: 'Trial' }));
  request.end();
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  const options = {
    method: 'POST',
    hostname: 'control.msg91.com',
    path: `/api/v5/otp/verify?otp=${otp}&mobile=${phone}`,
    headers: {
      authkey: MSG91_AUTH_KEY,
      'Content-Type': 'application/JSON',
    },
  };

  const request = https.request(options, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => {
      const body = Buffer.concat(chunks);
      const responseData = JSON.parse(body.toString());
      if (responseData.type === 'success') {
        res.status(200).json({ success: true, message: 'OTP verified successfully', data: responseData });
      } else {
        res.status(400).json({ success: false, message: responseData.message });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({ success: false, message: error.message });
  });

  request.end();
});

// Start the server
app.listen(5000, () => {
  console.log('Server running');
});


