var express = require('express');
var router = express.Router();
const Resource = require('../models/resource');
const User = require('../models/user');

router.get('/', async function (req, res) {
    Resource.find().then(response => {
        res.status(200).json(response);
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.findOne({ _id: req.params.id })
            .then(data => {
                User.findOne({ _id: data.user_id })
                    .then(user => {
                        data.user = user;
                        res.status(200).json(data);
                    })
                    .catch(error => res.status(404).json({ error }));
            })
            .catch(error => res.status(404).json({ error }));
    }
    else {
        res.status(404).json('Invalid resource ID');
    }
});

router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.findOne({ _id: req.params.id })
            .then(data => res.status(200).json(data))
            .catch(error => res.status(404).json({ error }));
    }
    else {
        res.status(404).json('Invalid resource ID');
    }
});

router.post('/', function (req, res) {
    var data = req.body;

    if (data.title != null && data.description != null && data.image != null && data.content != null && data.user_id != null) {
        var resource = new Resource({
            title: data.title,
            description: data.description,
            image: data.image,
            content: data.content,
            user_id: data.user_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        resource.save().then(response => {
            res.status(200).json(response);
        });
    }
});

// put ?
router.patch('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        var resource = { data: null };
        Resource.updateOne({ _id: req.params.id }, { resource })
            .then(() => res.status(200).json({ message: 'Resource updated.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(404).json('Invalid resource ID');
    }
});

router.delete('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Resource deleted.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(404).json('Invalid resource ID');
    }
});

module.exports = router;