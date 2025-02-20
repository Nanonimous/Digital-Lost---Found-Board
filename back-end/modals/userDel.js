import mongoose from 'mongoose';

// Define a schema for your data
const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true
  },
  password: {
    type:String,
    required:true
  },
});

// Create a model based on the schema
export default mongoose.model('user_details', userSchema);