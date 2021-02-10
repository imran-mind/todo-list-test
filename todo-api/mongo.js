const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/todos', {
    useNewUrlParser: true
});

console.log("DB connections established")