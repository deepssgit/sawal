const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const passport = require('passport')
require("dotenv").config()

// Signup user with email, password and first name
const signupUser = async (req, res) => {
	// Get required fields from request
	const { email, password, f_name } = req.body
	if (!email || !password || !f_name) {
		return res.json({
			error: "Required fields can not be empty."
		})
	}

	try {
		// Check if user already exist or not
		const _user = await User.findOne({ email: email })
		if (_user) {
			return res.json({
				error: "Email is already registred. Try another one.",
			})
		}

		// Hash the password and create a new user
		const hash = await bcrypt.hash(password, 10)
		const user = new User({
			email,
			name: f_name,
			password: hash
		})
		await user.save()
		res.redirect("/user/login")
		// res.json({
		// 	message: "Signup successfully."
		// })
	} catch (error) {
		res.json({
			error: "Something went wrong.",
			payload: error
		})
	}
}

// Login user with email and password
const loginUser = async (req, res) => {
	const { email, password } = req.body
	
	if (!email || !password) {
		return res.json({
			error: "Required fields can not be empty."
		})
	}

	try {
		// Check if user exist or not
		const user = await User.findOne({ email })
		if (user) {
			// Compate password if user exist
			if (await bcrypt.compare(password, user.password)) {
				// Genrate a jesonwebtoken and save it in cookie
				const token = jwt.sign({
					email: user.email,
					uid: user._id
				}, process.env.SECRET)
				res.cookie('token', token, { httpOnly: true });
				res.redirect("/userpost/timeline/"+ user._id)
			} else {
				res.json({
					error: "Invalid username or password." // Password didn't match
				})	
			}
		} else {
			res.json({
				error: "Invalid username or password." // Email didn't match
			})
		}
	} catch (error) {
		console.log(error);
		// Something went wrong with server, Use `error` as payload if required
		// res.json({
		// 	error: "Something went wrong.",
		// 	payload: error
		// })
	}
}

const userFollower = async (req,res) => {
	// user profile's id
	const { id: user_id } = req.params

	// logged in user's id
	
	const follower_id = req.user.uid
	const user = await User.findById({_id:follower_id})
	const notify = "you have been followed by " + user.name
	console.log(notify);
	await User.updateOne(
		{_id:user_id},
	    {
			$push:{followers:{user:follower_id},notifications:{notification:notify}}
		}
		)
		res.redirect("/user/timeline")
		

	// await User.updateOne(
	// 	{_id:user_id},
	// 	{
	// 		$push:{notificatons:{notificaton:notify}}
	// 	}
	// 	)
				

}

const updateUser = async (req, res) => {
	const { id: user_id } = req.params
	const uid = req.user.uid

	const {
		name,	
		about,	
		occupation,
		country,	
		gander,	
		birthday,
		hobbies,
		interests,
		experience,
		education,
		avatar,
		banner
	} = req.body

	try {
		if (user_id === uid) {
			const user = await User.findById(user_id)
			await User.updateOne(
				{ _id: user_id }, 
				{
					name: (name || user.name),	
					about: (about || user.about),	
					occupation: (occupation || user.occupation),
					country: (country || user.country),	
					gander: (gander || user.gander),	
					birthday: (birthday || user.birthday),
					hobbies: (hobbies || user.hobbies),
					interests: (interests || user.interests),
					experience: (experience || user.experience),
					education: (education || user.education),
					avatar: (avatar || user.avatar),
					banner: (banner || user.banner)
				}
			)
			res.json({
				error: "User info has been updated."
			})
		}
	} catch (error) {
		res.json({
			error: "Something went wrong."
		})
	}
}

// Authenticate user before using protected api routes 
const authenticate = (req, res, next) => {
	// Get saved token from requst cookies
	const token = req.cookies.token
	console.log(token);
	if (token) {
		// Get payload from jsonwebtoken
		const payload = jwt.verify(token, process.env.SECRET)
		if (payload) {
			req.user = payload
			console.log(payload);
			next()
		} else {
			res.redirect("/user/login")
			// res.json({
			// 	error: "Authantication failed",
			// 	login: false
			// })
		}
	} else {
		res.redirect("/user/login")

		// res.json({
		// 	error: "Authantication failed",
		// 	login: false
		// })
	}
}

// Authorize user if exist
const authorize = (req, res, next) => {
	// Get token from request cookies
	const token = req.cookies.token
	if (token) {
		// Get payload if user exist
		const payload = jwt.verify(token, process.env.SECRET)
		if (payload) {
			req.user = payload
		}
	}
	next()
}

const logoutUser = (req, res) => {
	req.logout()
	req.session.destroy()
	res.json({
		message: "Logged out successfully."
	})
}

module.exports = {
	userFollower,
	signupUser,
	loginUser,
	logoutUser,
	authenticate,
	authorize,
	updateUser,
}