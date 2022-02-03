require('dotenv').config();
const jwt = require('jsonwebtoken');
const sha256 = require('js-sha256');

var express = require('express');
var router = express.Router();

const User = require('../models/user');

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
}

function generateRefreshToken(user){
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}

router.post('/refresh-token', authenticateToken, function (req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(!token){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(401);
        }

        //TODO : check en bdd que le user a toujour les droits et qu'il existe toujours
        delete user.iat;
        delete user.exp;
        var refreshedToken = generateAccessToken(user);
        res.status(200).json({
            accessToken: refreshedToken
        });
    });
});

router.post('/login', function (req, res) {
    if(req.body.email == null || req.body.password == null){
        res.status(401).json("Invalid credentials");
    }
    const password = sha256(req.body.password);

    console.log(req.body)

    User.findOne({ email: req.body.email }).then(user => {
        if(user.password == password){
            var accessToken = generateAccessToken(user.toJSON());
            var refreshToken = generateRefreshToken(user.toJSON());
            res.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        }
        else{
            res.status(401).json("Invalid credentials");
        }
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ error });
    });
});

router.get('/me', authenticateToken, function (req, res) {
    res.status(200).json(req.user);
});

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}



module.exports = router;