const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = mongoose.Schema({
    value: { type: String},
    id:{type: String}
});

const EventSchema = mongoose.Schema({
    "value": { type: String },
    "id":{type: String},
    "username": {type: String},
    "subtasks": {
        type: [ TaskSchema ]
    }
});

module.exports = mongoose.model('Event', EventSchema);