const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../routes/auth');
const upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.put('/updatedetails', protect, upload.single('avatar'), authController.updateDetails);
router.put('/updatepassword', protect, authController.updatePassword);
router.post('/forgotpassword', authController.forgotPassword);
router.put('/resetpassword/:resettoken', authController.resetPassword);

module.exports = router;