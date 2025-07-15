const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.createAccessToken = (user) => {

	// payload
    // When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}


module.exports.verify = (req, res, next) => {

	console.log(req.headers.authorization)

	let token = req.headers.authorization;

	if(typeof token === "undefined") {

		return res.send({ auth: "Failed. No Token"});

	} else {
		console.log(token)
		token = token.slice(7, token.length);
		console.log(token);

		// Token verification
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {
			if(err) {
				return res.send({
					auth: "Failed",
					message: err.message
				});
			} else {
				console.log("Result from verify method:")
				console.log(decodedToken);

				req.user = decodedToken;

				next();
			}
		})
	}
}

module.exports.errorHandler = (err, req, res, next) => {
	console.error('Caught Error:', err);

	if (!err) {
		return res.status(500).json({
			error: {
				message: 'Unknown error occurred.',
				errorCode: 'NO_ERROR_OBJECT',
				details: null
			}
		});
	}

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	});
};
