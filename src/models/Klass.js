const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
// const mongooseDelete = require('mongoose-delete');

const KlassSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            isLength: {
                options: { min: 6, max:30 },
                errorMessage: 'Password should be at least 6 chars and max 30 chars',
            },
        },
        description: {
            type: String,
            isLength: {
                options: { min: 6, max:255 },
                errorMessage: 'Password should be at least 6 chars',
            },
            required:true
        },
        numberofsessions: {
            type: Number,
            default:0,
            required: true,
        },
        level: {
            type: [String],
            required: true,
        },
        lessions: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'lession',
            },
        ],
        slug: {
            type: String,
            slug: 'name',
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

KlassSchema.plugin(slug);
// KlassSchema.plugin(mongooseDelete, {
//     deletedAt: true,
//     overrideMethods: 'all',
// });

module.exports = mongoose.model('klass', KlassSchema);

