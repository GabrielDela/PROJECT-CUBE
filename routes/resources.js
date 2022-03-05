var express = require('express');
var router = express.Router();
const Resource = require('../models/resource');

//OK
router.get('/', function (req, res) {
    Resource.find().then(data => {
        res.status(200).json(data);
    });
});

//OK
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

// OK
router.post('/', function (req, res) {
    var data = req.query;
    if (data.title != null && data.description != null && data.content != null) {
        const resource = new Resource({ title: data.title, description: data.description, content: data.content });
        resource.save().then(() => {
            res.status(201).json({ message: 'Resource registered' });
        }).catch((error) => {
            res.status(400).json({ error });
        });
    }
    else {
        res.status(404).json('Invalid resource model');
    }
});

// OK
router.patch('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

        var data = req.query;
        if (data.title != null && data.description != null && data.content != null) {
            var resource = { title: data.title, description: data.description, content: data.content };
            Resource.updateOne({ _id: req.params.id }, { resource })
                .then(() => res.status(200).json({ message: 'Resource updated.' }))
                .catch(error => res.status(400).json({ error }));
        }
    }
    else {
        res.status(404).json('Invalid resource ID');
    }
});

// OK
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