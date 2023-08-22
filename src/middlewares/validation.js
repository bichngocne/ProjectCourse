const { body } = require('express-validator');

const validateRegistration = [
    body('email', 'Email is required').notEmpty().isEmail(),
    body(
        'password',
        'Password must be at least 6 characters and contain 1 special character',
    )
        .isLength({ min: 6 })
        .matches(/[!@#$%^&*(),.?":{}|<>]/),
];

module.exports = {
    validateRegistration,
};
