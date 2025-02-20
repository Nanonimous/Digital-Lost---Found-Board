import mongoose from 'mongoose';
import User from './modals/userDel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const hashPassword = async (password) => {
    const saltRounds = 10; // Cost factor for hashing (higher is more secure, but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password:', hashedPassword);
    return hashedPassword;
  };

// MongoDB Atlas connection string (replace with actual values)
const uri = process.env.CONNECTING_STRING;
// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


const createUser = async (item) => {

    const newUser = new User({
        username: "nivaas",
        password : await hashPassword('placement')
    });
// try {
//     const savedUser = await newUser.save();  // Save the new user to the database
//     console.log('New user saved:', savedUser);
//   } catch (error) {
//     console.error('Error saving user:', error);
//   }

try {
    const savedUser = await newUser.save();  // Save the new user to the database
    console.log('New user saved:', savedUser);
    // console.log("running")

  } catch (error) {
    console.error('Error saving user:', error);
  } 
 
};

// Call the function to add the user
// student_year_3.map(async(item)=>{
// createUser(item);
// })

createUser()