var express = require('express');
var router = express.Router();
const User = require('../models/user');

router.get('/', function (req, res) {
    User.find().then(data => {
        res.status(200).json(data);
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findOne({ _id: req.params.id })
            .then(data => res.status(200).json(data))
            .catch(error => res.status(404).json({ error }));
    }
    else {
        res.status(404).json('Invalid user ID');
    }
});

router.post('/', function (req, res) {
    var data = req.query;
    if (data.firstname != null && data.lastname != null && data.email != null) {
        const user = new User({ firstname: data.firstname, lastname: data.lastname, email: data.email, type: 'GOOGLE' });
        user.save().then(() => {
            res.status(201).json({ message: 'User registered' });
        }).catch((error) => {
            res.status(400).json({ error });
        });
    }
    else {
        res.status(404).json('Invalid user model');
    }
});

// put ?
router.patch('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        var user = { data: null };
        User.updateOne({ _id: req.params.id }, { user })
            .then(() => res.status(200).json({ message: 'User updated.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(404).json('Invalid user ID');
    }
});

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

module.exports = router;