const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const Login = async(req,res)=>{
    try {
        const{email,password} = req.body;
        const userFound = await User.findOne({where:{email}});
        if (!userFound){
            return res.status(404).send({ message: "unsuccessful", error: "user not found" });
        }
        const match= await bcrypt.compare(password,userFound.password);
        if(match){
            const {id,companyName,email} = userFound;
            console.log(process.env.SECRET_KEY)
            const token = jwt.sign({id,companyName,email},process.env.SECRET_KEY);
            return res.status(200).send({ message: "Success", token });
        }
        else {
            return res.status(401).send({ message: "Unsuccessful", error: "Invalid password" });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ message: "Internal server error" });
    }
}

const Register = async(req,res) =>{
    try {
        const {companyName,password:plainTextPassword,email,State} = req.body;
        password = (await (bcrypt.hash(plainTextPassword,10))).toString();
        const newUser = await User.create({companyName,password,email,State});
        if(!newUser){
            return res.status(400).send({ message: 'Email already exists' });
        }
       

        return res.status(201).send({message:'succces User created',newUser});
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
}


const changePassword = async(req,res)=>{
    try {
        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;
    
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        await user.update({ password: hashedPassword });
    
        res.status(200).json({ message: 'Password updated successfully' });
      } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

module.exports = {Register,Login,changePassword}