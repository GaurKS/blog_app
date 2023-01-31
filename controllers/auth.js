const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Validating email and generating jwt token
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        res.status(409).json({
            status: 409,
            error: "User Already Exist. Please Login"
        });
    }
    else {
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const token = jwt.sign(
                { name, email, hashPassword },
                process.env.JWT_ACCOUNT_ACTIVATION,
                { expiresIn: '2h' }
            );

            return res.status(201).json({
                status: 201,
                message: "Validate your token",
                token: token
            })
        } catch (err) {
            console.log(err);
            return res.status(403).json({
                status: 403,
                message: err
            });
        }
    }
};

// Activating user account and storing data in backend DB
exports.accountActivation = async (req, res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, async function (err, decoded) {
            if (err) {
                console.log('Account verification error by JWT', err);
                return res.status(401).json({
                    status: 401,
                    error: 'Link Expired. Sign Up Again'
                });
            };

            const { name, email, hashPassword } = jwt.decode(token);
            const newUser = await User.create({
                name: name,
                email: email,
                password: hashPassword
            });

            newUser.save((err, newUser) => {
                if (err) {
                    console.log('Error in saving user data in DB', err);
                    return res.status(401).json({
                        status: 401,
                        error: 'Error in saving user data in DB, Try Again'
                    });
                }
                return res.status(201).json({
                    status: 201,
                    message: 'User registered successfully! Sign in again to continue'
                });
            });
        });
    }
    else {
        return res.status(403).json({
            status: 403,
            message: 'Something went wrong! Please try again',
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            status: 400,
            message: 'User does not exist. Please Sign Up'
        });
    };

    // if user exist in db, authenticate his/her hashed_password for sign in
    if (user && (await bcrypt.compare(password, user.password))) {

        // if user is authenticated, generate a token for user
        const token = jwt.sign({ _id: user._id, email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const { _id, name, email } = user;
        await User.findOne({ email }).update({ sessionToken: token });

        return res.status(200).json({
            status: 200,
            token: token,
            user: { _id, name, email }
        });
    }
    // if user exist in db, authenticate his/her hashed_password for sign in
    return res.status(400).json({
        status: 400,
        error: 'Invalid email or password'
    });
};

// reset password workflow
// @req: email
exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(409).json({
            status: 409,
            error: "User does not exist! Please Sign up"
        });
    }
    else {
        try {
            // const hashNewPassword = await bcrypt.hash(newPassword, 10);
            const resetPasswordToken = jwt.sign(
                { email },
                process.env.JWT_ACCOUNT_ACTIVATION,
                { expiresIn: '1h' }
            );

            user.resetPasswordToken = resetPasswordToken;
            user.resetTokenExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            return res.status(201).json({
                status: 201,
                message: "Validate your token for password reset",
                token: resetPasswordToken
            })
        } catch (err) {
            console.log(err);
            return res.status(403).json({
                status: 403,
                message: err
            });
        }
    }
};

// checking for valid password reset account
// @req: newPassword
// @params: token
exports.setNewPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const resetToken = req.params.token;

        const decoded = jwt.verify(resetToken, process.env.JWT_ACCOUNT_ACTIVATION);

        const user = await User.findOne({
            email: decoded.email,
            resetPasswordToken: resetToken,
            resetTokenExpires: { $gt: Date.now() }
        });
        if (!user) {
            res.status(409).json({
                status: 409,
                error: "Password reset token is invalid or has expired"
            });
        }

        // reset password
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetTokenExpires = undefined;
        user.sessionToken = undefined;
        await user.save();

        return res.status(201).json({
            status: 201,
            // newPassword: newPassword,
            message: 'User password reset successful! Sign in again to continue'
        });
    } catch (error) {
        return res.status(403).json({
            status: 403,
            message: 'Something went wrong! Please try again',
            error: error
        });
    }
};