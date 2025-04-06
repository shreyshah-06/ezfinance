const {account, sdk} = require("../config/appwrite")
const User = require("../models/user");
const {validateEmail} = require("../utils/validation")

const sendOTP = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const isValidEmail = await validateEmail(email);
    if (!isValidEmail) {
        return res.status(400).json({ message: "Please provide a valid email address." });
    }
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      }
  
      const token = await account.createEmailToken(sdk.ID.unique(), email);
  
      if (!token) {
        return res.status(500).json({ message: "Failed to send verification email." });
      }
  
      return res.status(200).json({ message: "OTP sent successfully.", tokenId: token.userId });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  

  const validateOTP = async (req, res) => {
    const { userId, otp } = req.body;
  
    if (!userId || !otp) {
      return res.status(400).json({ message: "userId and otp are required." });
    }
  
    try {
      const session = await account.createSession(userId, otp);
  
      if (!session) {
        return res.status(401).json({ message: "Invalid or expired OTP." });
      }
  
      return res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
      console.error("OTP verification error:", error);
      return res.status(400).json({ message: "OTP verification failed." });
    }
  };
  

module.exports = { sendOTP, validateOTP };