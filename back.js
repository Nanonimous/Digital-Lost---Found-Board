import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { MongoClient, ServerApiVersion,ObjectId } from 'mongodb';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
dotenv.config();
const uri = process.env.CONNECTING_STRING;
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  } 
});


async function run() {
  try {
    // Connect the client to the server (starting from MongoDB v4.7, this is optional)
    await client.connect();
    const result = await db.command({ ping: 1 });
    console.log("Ping successful:", result);
    
    console.log("Successfully connected to MongoDB!");
    
    return db; // Return the database instance for further use
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process with a failure code
  }
}

// Run the connection test
let db1;
run()
.then((database) => {
  db = database; // Assign the database instance globally for use in routes or other operations
})
.catch(console.dir);




let db = client.db(process.env.DB_NAME);
const app = express();
const PORT = process.env.PORT;


// Pass `db` to routes using middleware
app.use((req, res, next) => {
  req.db = db; // Attach `db` to the request object
  next();
});



app.use(express.static(path.join(__dirname, "public")));








// Secret key for JWT
const SECRET_KEY = process.env.SECRET_KEY;
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // set max file size to 10MB
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL (adjust if different)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow cookies to be sent
};


app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true,limit:'100mb' }));
app.use(bodyParser.json({limit:'100mb'}));
app.use(cookieParser());




// routes set up





// MongoDB Atlas connection string (replace with actual values)

// Connect to MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });
import validator from 'validator'

// Middleware to trim spaces and sanitize username and email
const sanitizeInput = (req, res, next) => {
  // Trim and sanitize `username` if present
  if (req.body.username) {
    req.body.username = validator.escape(req.body.username.trim());
  }

  // Trim, normalize, and sanitize `email` if present
  if (req.body.email) {
    req.body.email = validator.escape(validator.normalizeEmail(req.body.email.trim()));
  }

  // For login, handle `loginInput` dynamically as email or username
  if (req.body.loginInput) {
    const isEmail = validator.isEmail(req.body.loginInput);
    req.body.loginInput = isEmail
      ? validator.escape(validator.normalizeEmail(req.body.loginInput.trim())) // Treat as email
      : validator.escape(req.body.loginInput.trim()); // Treat as username
  }

  next();
};


app.get("/login",(req,res)=>{
  res.sendFile(path.join(__dirname, "public", "html/login.html"));
})



// Login endpoint
app.post('/login', sanitizeInput, async (req, res) => {
  const { loginInput, password } = req.body;
  console.log(loginInput, password);


  const query = {username : loginInput };

  const user = await db.collection("user_details").findOne(query);

  if (!user) {
    return res.status(401).send({ message: 'Username or email does not exist' });
  }

  // Compare the password with the hashed password stored in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }
  var jwtPayload = {
    name : user.username,
  }
  // Create a JWT token
  const token = jwt.sign({ jwtPayload }, SECRET_KEY, { expiresIn: '1h' });

  // Send the token as the response
  res.cookie('jwtToken', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 3600000,
  });

  console.log('Set-Cookie:', res.getHeaders()['set-cookie']);

  res.redirect("/mainPage");
});

app.get("/mainPage",(req,res)=>{
  res.render("lost-fount.ejs");
})
import User from './modals/lost.js';
const createUser = async (item) => {

    const newUser = new User(item);
try {
    const savedUser = await newUser.save();  // Save the new user to the database
    console.log('New user saved:', savedUser);
    // console.log("running")

  } catch (error) {
    console.error('Error saving user:', error);
  } 
 
};
app.post("/submit-lost",upload.single("profile_photo"),(req,res)=>{
  const del = req.body;
  const image = req.file;
  del.profile_photo = image;
  createUser(del);
  console.log(del);
  res.redirect("/find")
})

app.get("/find", async (req,res)=>{
  try {
    const details = await User.find(); // Fetch all documents
    console.log(details);
    res.render("find.ejs",{find : details});
  } catch (err) {
    console.error(err);
  }
  res.render("find.ejs");
})

app.get("/lost",(req,res)=>{
  res.sendFile(path.join(__dirname, "public", "html/lost.html"))
})
//logout
app.post('/logout', (req, res) => {
  
  res.clearCookie('jwtToken'); // Clear the auth token cookie
  res.status(200).send({ message: 'Logged out successfully' });
});

//forget password

app.get("/",(req,res)=>{
  res.redirect("/login");
})

// Reset Password Endpoint


// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));