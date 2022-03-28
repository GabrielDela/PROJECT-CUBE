var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const sha256 = require('js-sha256');

router.get('/', function (req, res) {
    User.find().then(data => {
        res.status(200).json(data);
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOne({ _id: req.params.id })
            .then(data => {
                delete data.password;
                res.status(200).json(data)
            })
            .catch(error => res.status(404).json({ error }));
    }
    else {
        res.status(404).json('Invalid user ID');
    }
});


// create user
router.post('/', function (req, res) {
    var data = req.body;
    if (data.firstname != null && data.lastname != null && data.email != null) {
        if(data.password != null || data.google_id != null){

            var tag = '@' + data.firstname.substring(0, 2) + data.lastname.substring(0, 2) + Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
            var password = data.password != null ? sha256(data.password) : null;
            console.log(password);

            const user = new User({ 
                firstname: data.firstname, 
                lastname: data.lastname, 
                tag: tag, 
                biography: data.biography,
                email: data.email,
                password: password, 
                google_id: data.google_id, 
                avatar: data.avatar, 
                age: data.age
            });
            user.save().then(() => {
                res.status(201).json({ message: 'User registered' });
            }).catch((error) => {
                res.status(400).json({ error });
            });
        }
        else{
            res.status(404).json('Invalid user model');
        }
    }
    else {
        res.status(404).json('Invalid user model');
    }
});

// put ?
// router.patch('/:id', function (req, res) {
//     if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//         var user = { data: null };
//         User.updateOne({ _id: req.params.id }, { user })
//             .then(() => res.status(200).json({ message: 'User updated.' }))
//             .catch(error => res.status(400).json({ error }));
//     }
//     else {
//         res.status(404).json('Invalid user ID');
//     }
// });

router.delete('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'User deleted.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(404).json('Invalid user ID');
    }
});

// add a favorite in favorites array
router.put('/:id/favorites', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOne({ _id: req.params.id })
            .then(data => {
                if (data.favorites.indexOf(req.body.id) == -1) {
                    data.favorites.push(req.body.id);
                    data.save().then(() => res.status(200).json({ message: 'Favorite added.' }))
                        .catch(error => res.status(400).json({ error }));
                }
                else {
                    res.status(400).json({ message: 'Favorite already exists.' });
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(404).json('Invalid user ID');
    }
});

// remove a favorite from favorites array
router.delete('/:id/favorites', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOne({ _id: req.params.id })
            .then(data => {
                if (data.favorites.indexOf(req.body.id) != -1) {
                    data.favorites.splice(data.favorites.indexOf(req.body.id), 1);
                    data.save().then(() => res.status(200).json({ message: 'Favorite removed.' }))
                        .catch(error => res.status(400).json({ error }));
                }
                else {
                    res.status(400).json({ message: 'Favorite does not exist.' });
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(404).json('Invalid user ID');
    }
});

module.exports = router;