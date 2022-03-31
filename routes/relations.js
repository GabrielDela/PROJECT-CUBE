var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Relation = require('../models/relation');
const sha256 = require('js-sha256');

//OK
router.get('/', function (req, res) {
    Relation.find()
        .then(data => { res.status(200).json(data) })
        .catch(error => res.status(400).json({ error }));;
});

//OK
router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Relation.findOne({ _id: req.params.id })
            .then(data => res.status(200).json(data))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(400).json('Invalid Relation ID');
    }
});

//OK
router.post('/', function (req, res) {
    var data = req.query;

    if (data.id_from != null && data.id_to != null) {
        var model = {
            id_from: data.id_from,
            id_to: data.id_to,
        };
        data.relation == null ? null : model.relation = data.relation;

        const relation = new Relation(model);

        relation.save().then(() => {
            res.status(200).json({ message: 'Relation registered' });
        }).catch((error) => {
            res.status(400).json({ error });
        });
    }
    else {
        res.status(400).json('Invalid Relation model');
    }
});

//OK
router.get('/friends/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        var Relation_id = req.params.id;

        Relation.find({ id_from: Relation_id })
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
    else {
        res.status(400).json("Invalid user id");
    }
});

//OK
router.delete('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Relation.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Relation deleted.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(400).json('Invalid Relation ID');
    }
});

module.exports = router;