const bcrypt = require("bcrypt")
const User = require("../models/User")
const auth = require("../middleware/auth")
const { errorHandler } = auth;
const { cloudinary } = require("../middleware/cloudinary");



module.exports.registerUser = async (req, res) => {
	try {
		const { userName, email, mobileNo, info, password, confirmPassword } = req.body;

		let avatarUrl = '';
		if (req.file?.path) {
			avatarUrl = req.file.path;
		}

		const deleteUploadedImage = async () => {
			if (avatarUrl) {
				const publicId = avatarUrl.split('/').pop().split('.')[0];
				await cloudinary.uploader.destroy(`fitness-avatars/${publicId}`);
			}
		};

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			await deleteUploadedImage();
			return res.status(409).send({ message: 'Email already exists' });
		}

		// Check for missing fields
		if (!userName || !email || !mobileNo || !info || !password || !confirmPassword) {
			await deleteUploadedImage();
			return res.status(400).send({ message: 'All fields are required.' });
		}

		if (!email.includes('@')) {
			await deleteUploadedImage();
			return res.status(400).send({ message: 'Email invalid' });
		}

		if (info.trim() === '') {
			await deleteUploadedImage();
			return res.status(400).send({ message: 'Short description is required.' });
		}

		if (password.length < 8) {
			await deleteUploadedImage();
			return res.status(400).send({ message: 'Password must be at least 8 characters' });
		}

		if (mobileNo.length !== 11) {
			await deleteUploadedImage();
			return res.status(400).send({ message: 'Mobile number must be 11 digits' });
		}

		if (password !== confirmPassword) {
			await deleteUploadedImage();
			return res.status(400).send({ message: 'Passwords do not match' });
		}

		// Save user
		const newUser = new User({
			userName,
			email,
			mobileNo,
			info,
			avatar: avatarUrl,
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
						return res.status(401).send({ message: 'Incorrect email or password' });
					}
				}
			})
			.catch(err => errorHandler(err, req, res));
	} else {
		return res.status(400).send({ message: 'Invalid Email' })
	}
}


module.exports.getProfile = (req, res) => {
	// console.log(req.user)
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

module.exports.updateProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const { userName, email, mobileNo, info, password, confirmPassword } = req.body;

		// Basic validation (optional but recommended)
		if (password && password !== confirmPassword) {
			return res.status(400).json({ message: 'Passwords do not match' });
		}

		const updateFields = { userName, email, mobileNo, info };

		// Only update password if it is provided
		if (password) {
			// Hash password before saving (assuming you use bcrypt)
			const bcrypt = require('bcrypt');
			const hashedPassword = await bcrypt.hash(password, 10);
			updateFields.password = hashedPassword;
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			updateFields,
			{ new: true }
		);

		res.status(200).send({
			message: 'User updated successfully',
		});
	} catch (error) {
		errorHandler(error, req, res);
	}
};

module.exports.updateAvatar = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!req.file || !req.file.path) {
			return res.status(400).json({ message: 'No image uploaded' });
		}

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: 'User not found' });

		// Optional: delete old avatar from Cloudinary
		if (user.avatar) {
			try {
				const publicId = user.avatar.split('/').pop().split('.')[0];
				await cloudinary.uploader.destroy(`fitness-avatars/${publicId}`);
			} catch (err) {
				console.warn('Failed to delete old avatar:', err.message);
			}
		}

		user.avatar = req.file.path;
		await user.save();

		res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
	} catch (err) {
		console.error('Update avatar error:', err.message);
		res.status(500).json({ message: 'Server error' });
	}
};
