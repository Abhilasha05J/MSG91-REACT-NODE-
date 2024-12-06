import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

function VerifyOtp() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Function to send OTP
  const sendOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        alert("OTP Sent Successfully");
        console.log(result)
      } else {
        console.error(result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error sending OTP");
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/verify-otp", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const result = await response.json();
      if (result.success) {
        alert("OTP Verified Successfully");
      } else {
        console.error(result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3, gap: 2, textAlign: "center" }}>
      <Typography variant="h5">OTP Verification</Typography>
      {!otpSent ? (
        <>
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button variant="contained" onClick={sendOtp} sx={{ mt: 2 }}>
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button variant="contained" onClick={verifyOtp} sx={{ mt: 2 }}>
            Verify OTP
          </Button>
        </>
      )}
    </Box>
  );
}

export default VerifyOtp;



      