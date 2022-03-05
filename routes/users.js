var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Relation = require('../models/relation');
const sha256 = require('js-sha256');

//OK
router.get('/', function (req, res) {
    User.find()
    .then(data => { res.status(200).json(data)})
    .catch(error => res.status(400).json({ error }));;
});

//OK
router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOne({ _id: req.params.id })
            .then(data => res.status(200).json(data))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(400).json('Invalid user ID');
    }
});

//OK
router.post('/', function (req, res) {
    var data = req.query;

    if (data.firstname != null && data.lastname != null && data.email != null && ((data.password == null && data.google_id != null) || (data.password != null && data.google_id == null))) {
        
        const password = password != null ? sha256(req.body.password) : null;

        var userModel = {
            firstname: data.firstname, 
            lastname: data.lastname, 
            email: data.email,
        };
        password == null ? null : userModel.password = password;
        data.role_id == null ? null : userModel.role_id = data.role_id;
        data.age == null ? null : userModel.age = data.age;
        data.google_id == null ? null : userModel.google_id = data.google_id;
        data.description == null ? null : userModel.description = data.description;
        data.avatar == null ? null : userModel.avatar = data.avatar;

        const user = new User(userModel);

        user.save().then(() => {
            res.status(200).json({ message: 'User registered' });
        }).catch((error) => {
            res.status(400).json({ error });
        });
    }
    else {
        res.status(400).json('Invalid user model');
    }
});

//OK
router.get('/friends/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        var user_id = req.params.id;

        Relation.find({ id_from: user_id })
            .then(data => {
                var ids = [];
                data.forEach(data => {
                    ids.push(data.id_to);
                });

                User.find({ _id: { "$in": ids } })
                    .then(data => {
                        res.status(200).json(data);
                    })
                    .catch(e => {
                        res.status(400).json(e);
                    });
            })
            .catch(e => {
                res.status(400).json(e);
            });
    }
    else{
        res.status(400).json("Invalid user id");
    }
});

//OK
router.patch('/:id', function (req, res) {
    var user = req.query;
    if(user.pasword != null){
        user.password = sha256(user.pasword);
    }
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.updateOne({ _id: req.params.id }, user)
            .then(() => res.status(200).json({ message: 'User updated.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(400).json('Invalid user ID');
    }
});

//OK
router.delete('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'User deleted.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(400).json('Invalid user ID');
    }
});

module.exports = router;