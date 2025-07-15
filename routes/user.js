const express = require("express");
const multer = require('multer');
const userController = require("../controllers/user")
const { verify } = require("../middleware/auth")
const { multerUpload } = require('../config/cloudinary');

const router = express.Router();


router.post("/register", multerUpload.single('avatar'), userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
router.put("/update", verify, userController.updateProfile);
router.patch('/update-avatar', verify, multerUpload.single('avatar'), userController.updateAvatar);


module.exports = router;