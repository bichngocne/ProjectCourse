const mongoose = require('mongoose');
async function connect(res, res, next) {
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect db successful');
    } catch (e) {
        console.error('Connect db unsuccessful', e);
    }
}

module.exports = connect;
