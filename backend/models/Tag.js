const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String},
});

module.exports = mongoose.model('Tag', tagSchema);
