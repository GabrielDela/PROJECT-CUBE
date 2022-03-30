var express = require('express');
var router = express.Router();
const Resource = require('../models/resource');
const User = require('../models/user');
const Comment = require('../models/comment');
var formidable = require('formidable');
const fs = require('fs');

// router.get('/', function (req, res) {
//     Resource.find({ deleted: false, desactivated: false }).then(response => {
//         res.status(200).json(response);
//     });
// });

// get resource with a list in body of id
router.post('/list', function (req, res) {
    var data = req.body;

    if (data.length > 0) {
        Resource.find({ _id: { $in: data }, deleted: false, desactivated: false }).then(response => {
            res.status(200).json(response);
        }).catch(error => {
            res.status(404).json({ error });
        });
    }
});


// get all resource without field content
router.get('/', function (req, res) {
    Resource.find({ deleted: false, desactivated: false }, { content: 0 }).then(response => {
        res.status(200).json(response);
    });
});

router.get('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.findOne({ _id: req.params.id, deleted: false, desactivated: false })
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

router.post('/', function (req, res) {
    var data = req.body;

    if (data.title != null && data.description != null && data.image != null && data.content != null && data.user_id != null) {
        var resource = new Resource({
            title: data.title,
            description: data.description,
            image: data.image,
            content: data.content,
            user_id: data.user_id,
            category_id: data.category_id,
            type_id: data.type_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        resource.save().then(response => {
            res.status(200).json(response);
        });
    }
});

// patch
router.patch('/:id', function (req, res) {
    var data = req.body;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.findOne({ _id: req.params.id })
            .then(data => {
                if (data != null) {
                    // update
                    Resource.updateOne({ _id: req.params.id }, {
                        $set: {
                            title: data.title,
                            description: data.description,
                            image: data.image,
                            content: data.content,
                            updated_at: new Date()
                        }
                    }).then(response => {
                        res.status(200).json(response);
                    }).catch(error => res.status(404).json({ error }));
                }
                else {
                    res.status(404).json('Resource not found');
                }
            })
            .catch(error => res.status(404).json({ error }));
    }
    else {
        res.status(404).json('Invalid resource ID');
    }
});

router.delete('/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.updateOne({ _id: req.params.id }, {
            $set: {
                deleted: true
            }
        }).then(response => {
            res.status(200).json(response);
        }).catch(error => res.status(404).json({ error }));
    }
});

router.delete('/:id/end', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.deleteOne({ _id: req.params.id }).then(response => {
            res.status(200).json(response);
        }).catch(error => res.status(404).json({ error }));
    }
});

// get resource where user_id = id
router.get('/user/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Resource.find({ user_id: req.params.id, deleted: false, desactivated: false }).then(response => {
            res.status(200).json(response);
        });
    }
});

// get resources with count of comments
router.get('/comments/count/:id', function (req, res) {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        Comment.countDocuments({ id_resource: req.params.id, deleted: false })
            .then(count => res.status(200).json(count))
            .catch(error => res.status(400).json({ error }));
    }
});

// uplaod image server xhr
router.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log(files)
        var oldpath = files.image.filepath;
        // generate random string
        let newName = Math.random().toString(36).substring(2, 15) + files.image.originalFilename;
        var newpath = 'public/api/images/' + newName;
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                res.status(400).json({ error: err });
            }
            else {
                res.status(200).json({ image: newName });
            }
        });
    });
});



module.exports = router;