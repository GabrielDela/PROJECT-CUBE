require('dotenv').config();
const jwt = require('jsonwebtoken');
const sha256 = require('js-sha256');

var express = require('express');
var router = express.Router();

const User = require('../models/user');

router.post('/login', function (req, res) {

    
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            res.json({
                success: false,
                message: 'Error: ' + err
            });
        } else {
            if (user) {
                
                const password = sha256(req.body.password);
                if (user.password == password) {
                    var token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '24h'
                    });
                    res.json({
                        success: true,
                        message: 'Successfully Logged In!',
                        token: token
                    });
                } else {
                    res.json({
                        success: false,
                        message: 'Incorrect Password'
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: 'Email not found'
                });
            }
        }
    });
});

router.get('/me', function (req, res) {
    var token = req.headers['authorization'];
    token = token.slice(7, token.length);
    
    if (!token) {
        res.json({
            success: false,
            message: 'No token provided'
        });
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Token invalid: ' + err
                });
            } else {
                // find user in db
                User.findOne({
                    _id: decoded.user._id
                }, function (err, user) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'User not found: ' + err
                        });
                    } else {
                        if (!user) {
                            res.json({
                                success: false,
                                message: 'User not found',
                            });
                        }
                        else {
                            res.json({
                                success: true,
                                user: decoded
                            });
                        }
                    }
                });
                
                
            }
        });
    }
});

// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.sendStatus(401);
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) {
//             return res.sendStatus(401);
//         }
//         req.user = user;
//         next();
//     });
// }

module.exports = router;