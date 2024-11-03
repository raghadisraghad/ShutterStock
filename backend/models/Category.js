const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    tag: { type: String}
});

module.exports = mongoose.model('Tag', categorySchema);
