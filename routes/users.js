var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Relation = require('../models/relation');

router.get('/', function (req, res) {
    User.find().then(data => {
        res.status(200).json(data);
    });
});

// router.get('/:id', function (req, res) {
//     if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//         User.findOne({ _id: req.params.id })
//             .then(data => res.status(200).json(data))
//             .catch(error => res.status(404).json({ error }));
//     }
//     else {
//         res.status(404).json('Invalid user ID');
//     }
// });

router.post('/', function (req, res) {
    console.log(req.body);
    return res.status(201).json("TEST");
    var data = req.query;

    if (data.firstname != null && data.lastname != null && data.email != null) {
        const user = new User({ firstname: data.firstname, lastname: data.lastname, email: data.email });
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
                        res.status(500).json(e);
                    });
            })
            .catch(e => {
                res.status(500).json(e);
            });
    }
    else{

        res.status(500).json("Invalid user id");
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

// router.delete('/:id', function (req, res) {
//     if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//         User.deleteOne({ _id: req.params.id })
//             .then(() => res.status(200).json({ message: 'User deleted.' }))
//             .catch(error => res.status(400).json({ error }));
//     }
//     else {
//         res.status(404).json('Invalid user ID');
//     }
// });

// router.get('/:id', function (req, res) {
//     if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//         User.findOne({ _id: req.params.id })
//             .then(data => res.status(200).json(data))
//             .catch(error => res.status(404).json({ error }));
//     }
//     else {
//         res.status(404).json('Invalid user ID');
//     }
// });

module.exports = router;