const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
	name: String,				// User's name
	about: String,				// User's bio
	occupation: String,			// User's occupation
	country: String,			// User's country
	gander: String,				// User's gender
	birthday: Date,				// User's Birthday
	password: String,			// User's password, Hashed
	hobbies: String,			// User's hobbies, comma seprated
	interests: String,			// User's interest, comma sepreted
	experience: [String],		// List of User's experience
	education: [String],		// List of User's educations
	avatar: {					// Link to User's avatar
		type: String,
		default: 'avatar.png'
	},
	banner: {					// Link to User's banner image
		type: String,
		default: 'banner.png'
	},
	email: {					// User's email
		type: String,
		unique: true
	},
	joined: {					// Date user joined
		type: Date,
		default: Date.now
	}
})
module.exports = mongoose.model('User', userSchema)