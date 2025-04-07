const bcrypt = require("bcrypt");
const User = require("../models/user");
const { createAccessToken } = require("../utils/token");
const { validatePassword } = require("../utils/validation");
const sequelize = require("../config/database");

// Login function to authenticate the user
const Login = async (req, res) => {
    try {
      const { email, password } = req.body;  // Extract email and password from request body
      
      // Find user by email in the database
      const userFound = await User.findOne({ where: { email } });
      if (!userFound) {
        return res
          .status(404)
          .send({ message: "unsuccessful", error: "user not found" });  // Return error if user not found
      }
  
      // Compare provided password with the stored hashed password
      const match = await bcrypt.compare(password, userFound.password);
      if (match) {
        const { id, companyName, email } = userFound;  // Extract user info
        const token = createAccessToken({ id, companyName, email });  // Generate access token
        return res.status(200).send({ message: "Success", token });  // Return success with token
      } else {
        return res
          .status(401)
          .send({ message: "Unsuccessful", error: "Incorrect password" });  // Return error if password doesn't match
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ message: "Internal server error" }); 
    }
  };
  
  // Register function to create a new user
  const Register = async (req, res) => {
    try {
      const { companyName, password: plainTextPassword, email, State } = req.body;  // Extract fields from request body
      
      // Validate password strength
      if (!validatePassword(plainTextPassword)) {
        return res.status(400).json({
          msg: "Password must be at least 8 characters long and include a number and a special character.",
        });  // Return error if password is weak
      }
  
      // Hash the plain text password
      password = (await bcrypt.hash(plainTextPassword, 10)).toString();
      
      // Create a new user in the database
      const newUser = await User.create({ companyName, password, email, State });
      if (!newUser) {
        return res.status(400).send({ message: "Failed to Register" });  // Return error if user creation fails
      }
  
      // Return success with new user data
      return res
        .status(201)
        .send({ message: "Account created successfully", newUser });
    } catch (error) {
      console.error("Error creating user:", error); 
      return res.status(500).send({ message: "Internal server error" }); 
    }
  };
  
  const changePassword = async (req, res) => {
    try {
      // Extract userId from the decoded token (from the middleware)
      const userId = req.user.id;  // Now we get the userId directly from the token
  
      const { currentPassword, newPassword } = req.body;  // Extract current and new passwords from the request body
  
      // Find user by userId
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });  // Return error if user not found
      }
  
      // Compare the current password with the stored password
      console.log("User Details:", user.dataValues.password);
      const passwordMatch = await bcrypt.compare(currentPassword, user.dataValues.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });  // Return error if current password is incorrect
      }
  
      // Validate new password strength
      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          msg: "Password must be at least 8 characters long and include a number and a special character.",
        });  // Return error if new password is weak
      }
  
      // Hash the new password before updating it in the database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      await user.update({ password: hashedPassword });
  
      // Return success message after password update
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error); 
      res.status(500).json({ error: "Internal server error" }); 
    }
  };

const deleteUser = async(req, res) => {
  // Start a new transaction to ensure the deletion is atomic
  // const transaction = await sequelize.transaction();
  try {
    const email = req.body;
    if(!email){
      return res.status(400).json({error : "Email is required"});
    }
    // Find the user to be deleted
    // const user = await User.findOne({ where: {email}, transaction });
    // if (!user) {
    //   // Rollback transaction if the user doesn't exist
    //   await transaction.rollback();
    //   return res.status(404).json({ error: "User not found" });
    // }
    const deletedUser = await User.destroy({
      where: { email}
    });
     // Check if the deletion was successful
     if (deletedUser === 0) {
      await transaction.rollback(); // Rollback if no invoice was deleted
      return res.status(404).json({ error: "Error while Deletion" });
    }

    // Commit the transaction to finalize the deletion
    // await transaction.commit();

    // Respond with a success message
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Rollback in case of an error to ensure data consistency
    // await transaction.rollback();
    res.status(500).json({ error: "Internal server error" });
  }
}
  
module.exports = { Register, Login, changePassword, deleteUser};
