const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            isLength: {
                options: { min: 6, max:30 },
            },
        },
        description: {
            type: String,
            isLength: {
                options: { min: 6, max:255 },
            },
            required:true
        },
        enrollment_limit: {
            type: Number,
            default:0,
            required: true,
        },
        images:{ type: [String]},
        price: {
            type: Number,
            default:0,
            required: true,
        },
        level: {
            type: [String],
            required: true,
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

courseSchema.plugin(slug);
courseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Course', courseSchema);

