const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            validate: {
                validator: isEmail,
                message: 'Email is incorrect format',
            },
        },
        password: {
            type: String,
            isLength: {
                options: { min: 6 },
                errorMessage: 'Password should be at least 6 chars',
            },
        },
        phone: {
            type: Number,
            required: false,
        },
        role: {
            type: [String],
            require: false,
            default: ['user'],
        },
        slug: {
            type: String,
            slug: 'email',
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.plugin(slug);
userSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
