const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
const cors = require('cors');

dotenv.config();

app.use(express.json());
app.use(cors()); // Enable All CORS Requests


mongoose.connect(process.env.MONGO_URL, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true })
.then (() => {
	  console.log('MongoDB connected!');
	}).catch((err) => {
	  console.log('MongoDB connection error: ', err);
	});

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);


app.listen("8800", () => {
  console.log("Backend server is running!");
});
