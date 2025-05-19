const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error("Twilio credentials missing. Please check your .env file.");
  return;
}

const client = require('twilio')(accountSid, authToken);

const sendSMS = async (to, body) => {
  if (!to) {
    console.error("Recipient phone number is required");
    return;
  }
    if (!body) {
    console.error("Message body is required");
    return;
  }
  
  let msgOptions = {
    from: process.env.TWILIO_FROM_NUMBER,
    to: to,
    body: body
  }
  
  try {
    const message = await client.messages.create(msgOptions);
    console.log("SMS sent successfully:", message.sid);
    return message;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}

module.exports = sendSMS;