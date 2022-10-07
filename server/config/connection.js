const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Twitchlytical', {

});

module.exports = mongoose.connection;
