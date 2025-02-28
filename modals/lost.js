import mongoose from 'mongoose';

// Define a schema for your data
const userSchema = new mongoose.Schema({
  fname: {
    type:String,
    required:true
  },
  lname: {
    type:String,
    required:true
  },
  Mail:{
    type:String,
    required:true
  },
  Phone:{
    type:String,
    required:true
  },
  Message:{
    type:String,
    required:true
  },
  profile_photo: {
    data: Buffer,
    contentType: String
}

});

// Create a model based on the schema
export default mongoose.model('lost', userSchema);