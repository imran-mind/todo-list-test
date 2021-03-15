const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UsersModel = require('./models/user.model');
const Event = require('./models/event.model');
var cors = require('cors');
const auth = require('./auth');
const db = require('./mongo');
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.post('/api/login', async (req, res) => {
    try {
        const data = await UsersModel.find({
            username: req.body.username,
            password: req.body.password
        });
        if (data && data.length) {
            const token = auth.createJWT(req.body);
            return res.status(200).json({
                message: 'Login success',
                token
            })
        } else {
            return res.status(400).json({
                message: 'Login Failed'
            })
        }
    } catch (err) {
        return res.status(500).jsonp({
            error: err
        });
    }
});

app.post('/api/todos', auth.ensureAuthenticated, async(req,res)=>{
    console.log(req.body)
    // const user = auth.decodeToken(req.headers.authorization,)
    const {username} = req.userInfo;
    console.log('---- ',req.userInfo)
    var e = new Event({...req.body,username});
    console.log('db todo',e)
    try {
        e = await e.save(req.body);
        return res.status(201).json({
            message: " todo created ",
            e
        });
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

app.get('/api/todos', auth.ensureAuthenticated, async(req,res)=>{
    console.log('todo get all records ')
    try {
        const {username} = req.userInfo;
        const data = await Event.find({username: username});
        if (data) {
            return res.status(200).json({
                message: 'success',
                data
            })
        } else {
            return res.status(400).json({
                message: 'Failed'
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: err
        });
    }
});

app.put('/api/todos/:id', auth.ensureAuthenticated, async(req,res)=>{
    console.log('todo updating call id ',req.params.id,req.body)
    try {
        let data = await Event.findOne({
            id: req.params.id
        });
        let updateTodo = await Event.updateOne({
            _id: data._id
        }, req.body);

        if (updateTodo) {
            return res.status(200).json({
                message: 'success',
                updateTodo
            })
        } else {
            return res.status(400).json({
                message: 'Failed'
            })
        }
    } catch (err) {
        console.log('error while updating todos : ',err);
        return res.status(500).json({
            error: err
        });
    }
});


app.delete('/api/todos/:id', auth.ensureAuthenticated, async(req,res)=>{
    console.log('todo deleting call id ',req.params.id)
    try {
        let data = await Event.deleteOne({
            id: req.params.id
        });
        if (data) {
            return res.status(200).json({
                message: 'success',
                data
            })
        } else {
            return res.status(400).json({
                message: 'Failed'
            })
        }
    } catch (err) {
        console.log('error while deleting todos : ',err);
        return res.status(500).json({
            error: err
        });
    }
});


app.post('/api/signup', async (req, res) => {
    console.log('signup body ->',req.body)
    let userInfo = new UsersModel(req.body);
    const data = await UsersModel.find({
        username: req.body.username
    });
    if (data && data.length) {
        return res.status(200).json({
            message: " user already exist ",
            data: data
        });
    }
    try {
        userInfo = await userInfo.save();
        return res.status(201).json({
            message: " user created ",
            data: userInfo
        });
    } catch (err) {
        return res.status(500).jsonp({
            error: err
        });
    }
});




app.listen(5000, () => {
    console.log("server is up on 5000");
});