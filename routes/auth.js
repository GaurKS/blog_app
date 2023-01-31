const express = require('express');
const router = express.Router();

// importing controls from controller
const { signup, signin, resetPassword, accountActivation, setNewPassword } = require("../controllers/auth");


// importing validators
const { userSignupValidator, userSigninValidator, userResetPassword, setPassword } = require('../validators/auth');
const { runValidation } = require('../validators/index');


// routing endpoints to middlewares
// two step auth
router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/account-activation', accountActivation);

router.post('/signin', userSigninValidator, runValidation, signin);

router.post('/reset-password', userResetPassword, runValidation, resetPassword);
router.put('/setPassword/:token', setPassword, setNewPassword);

module.exports = router;