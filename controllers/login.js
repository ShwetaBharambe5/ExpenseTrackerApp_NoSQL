const ExistingUser = require('../models/user');

const loginRoute = require('../routes/login');

const path = require('path');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

function generateAccessToken(id, name, isPremiumUser) {
    return jwt.sign({ id: id, name: name, isPremiumUser: isPremiumUser }, 'secretkey');
}

const getLoginForm = async (req, res) => {
    res.sendFile('login.html', { root: 'public/views' });
};

const addLoginDetails = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: 'Email or password is missing', success: false });
        }

        // Check if the user with the given email exists
        const user = await ExistingUser.find({ email: email });

        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong');
                }
                if (result === true) {
                    return res.status(200).json({
                        success: true,
                        message: 'User logged in successfully',
                        token: generateAccessToken(user[0].id, user[0].name, user[0].isPremiumUser)
                    });
                } else {
                    return res.status(400).json({ success: false, message: 'Password is incorrect' });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getLoginForm,
    addLoginDetails
};
