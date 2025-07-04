const bcrypt = require("bcrypt")
const User = require("../models/User")
const auth = require("../auth")
const { errorHandler } = auth;



module.exports.registerUser = async (req, res) => {
	try {
		const { userName, email, mobileNo, password, confirmPassword } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).send({ message: 'Email already exists' });
		}
		
		// Validate email format
		if (!email.includes('@')) {
			return res.status(400).send({ message: 'Email invalid' });
		}

		// Validate password length
		if (password.length < 8) {
			return res.status(400).send({ message: 'Password must be at least 8 characters' });
		}

		if (mobileNo.length !== 11) {
			return res.status(400).send({ message: 'Mobile number must be 11 digits'})
		}

		if (password !== confirmPassword) {
			return res.status(400).send({ message: 'Password do not match'})
		}

		// Create and save new user
		const newUser = new User({
			userName,
			email,
			mobileNo,
			password: bcrypt.hashSync(password, 10),
		});

		await newUser.save();
		return res.status(201).send({ message: 'Registered Successfully' });

	} catch (err) {
		console.error('Register Error:', err);
		return res.status(500).send({ message: 'Server error' });
	}
};


module.exports.loginUser = (req, res) => {

	if (req.body.email.includes("@")) {
		return User.findOne({ email: req.body.email })
			.then(result => {

				if (result === null) {

					return res.status(404).send({ message: 'No Email found' });

				} else {

					const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

					if (isPasswordCorrect) {

						return res.status(201).send({
							access: auth.createAccessToken(result)

						});

					} else {
						return res.status(401).send({ message: 'Email and password do not match' });
					}
				}
			})
			.catch(err => errorHandler(err, req, res));
	} else {
		return res.status(400).send({ message: 'Invalid Email' })
	}

}


module.exports.getProfile = (req, res) => {
	console.log(req.user)
	return User.findById(req.user.id)
		.then(user => {
			if (!user) {
				return res.status(404).send({ error: 'User not found' });
			}

			user.password = undefined;

			return res.status(200).send({ user });
		})
		.catch(err => {
			console.error("Error in fetching user profile", err)
			return res.status(500).send({ error: 'Failed to fetch user profile' })
		});

};