var express = require('express');
var router = express.Router();
const Comment = require('../models/comment');
const Resource = require('../models/resource');
const User = require('../models/user');

router.get('/', function (req, res) {
    Comment.find().then(data => {
        res.status(200).json(data);
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Comment.findOne({ _id: req.params.id })
            .then(comment => {
                User.findOne({ _id: comment.id_user })
                    .then(user => {
                        Resource.findOne({ _id: comment.id_relationship })
                            .then(resource => {
                                res.status(200).json({comment: comment, user: user, relation: resource });
                            })
                            .catch(error => res.status(404).json({ error }));
                    })
                    .catch(error => res.status(404).json({ error }));
            })
            .catch(error => res.status(404).json({ error }));
    }
    else {
        res.status(404).json('Invalid comment ID');
    }
});

router.post('/', function (req, res) {
    var data = req.query;
    if (data.id_relationship != null && data.id_user != null && data.comment != null) {
        const comment = new Comment({ id_relationship: data.id_relationship, id_user: data.id_user, comment: data.comment });
        comment.save().then(() => {
            res.status(201).json({ message: 'Comment registered' });
        }).catch((error) => {
            res.status(400).json({ error });
        });
    }
    else {
        res.status(404).json('Invalid comment model');
    }
});

router.delete('/:id', function (req, res) {
    // Ici, on ne supprime pas réelement le message, on le cache car sinon, les commentaires ayant des relations 
    // avec celui-ci pourrais avoir une erreur lors du chargement de la vue du commentaire.
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Comment.updateOne({ _id: req.params.id }, { deleted: true })
            .then(() => res.status(200).json({ message: 'Comment updated.' }))
            .catch(error => res.status(400).json({ error }));
    }
    else {
        res.status(404).json('Invalid comment ID');
    }
});


module.exports = router;