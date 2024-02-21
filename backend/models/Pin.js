const mongoose = require('mongoose');
const PinSchema = new mongoose.Schema({  
	username: {
		type: String,   
		require: true, 
	},
	title: {
		type: String,
		require: true,
		min: 3
	},
	desc: {
		type: String,
		require: true,
		min: 3
	},
	rating: {
		type: Number,
		require: true,
		min: 0,
		max: 5
	},
	long: {
		type: Number,
		require: true
	},
	lat: {
		type: Number,
		require: true
	}
}, 
{ timestamps: true } 
);

module.exports = mongoose.model("Pin", PinSchema); // This line exports a Mongoose model based on the PinSchema. The model is named "Pin," and it can be used to interact with the MongoDB collection corresponding to this schema.




// Extra Comments for better code explanation -

// const PinSchema = new mongoose.Schema({  // This schema specifies the structure and validation rules for documents stored in the corresponding MongoDB collection.
// 	username: {
// 		type: String,   // Validation Rules are defined like this
// 		require: true,  // If a document is attempted to be saved without a value for the username field, Mongoose will throw a validation error, preventing the document from being saved to the database.
// 	},


// { timestamps: true } // It specifically enables the automatic generation of createdAt and updatedAt fields in each document using the timestamps option