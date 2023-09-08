const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const lessionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            isLength: {
                options: { min: 6, max: 30 },
            },
        },
        description: {
            type: String,
            isLength: {
                options: { min: 6, max: 255 },
            },
            required: true
        },
        audios: { type: String, required: false },
        videos: { type: String, required: false },
        exercises: {
            type: String,
            required: false,
        },
        class: {
                type: mongoose.Schema.ObjectId,
                required: true,
                ref: "klass"
            },
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

lessionSchema.plugin(slug);
// lessionSchema.plugin(mongooseDelete, {
//     deletedAt: true,
//     overrideMethods: 'all',
// });

module.exports = mongoose.model('lession', lessionSchema);

