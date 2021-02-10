const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    createdAt: {
        type: Number,
        default: moment().valueOf()
    },
    updatedAt: {
        type: Number,
        default: moment().valueOf()
    },
});

const Users = mongoose.model('users', userSchema);

module.exports = Users;