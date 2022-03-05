require('dotenv').config();
const jwt = require('jsonwebtoken');
const sha256 = require('js-sha256');

var express = require('express');
var router = express.Router();

const User = require('../models/user');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
}

router.post('/refresh-token', authenticateToken, function (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(400);
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(400);
        }

        User.findOne({ email: user.email }).then(result => {
            if (user.password == result.password) {
                delete user.iat;
                delete user.exp;
                var refreshedToken = generateAccessToken(user);
                res.status(200).json({
                    accessToken: refreshedToken
                });
            }
            else {
                res.status(400).json("Invalid credentials");
            }
        }).catch((error) => {
            console.log(error);
            res.status(400).json({ error });
        });
    });
});

router.post('/login', function (req, res) {
    if (req.body.email == null || req.body.password == null) {
        res.status(400).json("Invalid credentials");
    }
    const password = sha256(req.body.password);

    console.log(req.body)

    User.findOne({ email: req.body.email }).then(user => {
        if (user.password == password) {
            var accessToken = generateAccessToken(user.toJSON());
            var refreshToken = generateRefreshToken(user.toJSON());
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
        else {
            res.status(400).json("Invalid credentials");
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ error });
    });
});

router.get('/me', authenticateToken, function (req, res) {
    User.findOne({ email: req.user.email }).then(user => {
        if (req.user.password == user.password) {
            res.status(200).json(req.user);
        }
        else {
            res.status(400).json("Invalid credentials");
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ error });
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(400);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(400);
        }
        req.user = user;
        next();
    });
}

router.post('/register', function (req, res) {
    console.log(req.body);
    if (req.body.firstname != null && req.body.lastname != null && req.body.email == null && (req.body.password == null && req.body.google_id != null)) {
        res.status(400).json("Invalid informations");
    }
    else{
        var user;
        
        if(req.body.google_id != null){
            user = new User({
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                google_id: req.body.google_id,
            });
        }
        else{
            const password = sha256(req.body.password);
            user = new User({
                email: req.body.email,
                password: password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            });
        }
        
        user.save().then((user) => {
            res.status(200).json(user);
        }).catch((error) => {
            res.status(400).json(error);
        });
    }
});


module.exports = router;