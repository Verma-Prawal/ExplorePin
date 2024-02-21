const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		min: 3,
		max: 20,
		unique: true 
	},
	email: {
		type: String,
		require: true,
		max: 50,
		unique: true
	},
	password: {
		type: String,
		require: true,
		min: 6
	},
}, 
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);


// const UserSchema = new mongoose.Schema({
// 	username: {
// 		type: String,
// 		require: true,
// 		min: 3,
// 		max: 20,
// 		unique: true // This ensures that each username and email in the collection must be unique. If you attempt to create or update a document with a non-unique value in these fields, Mongoose will throw a validation error.
// 	},