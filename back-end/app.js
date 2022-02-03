require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');

const AuthRoutes = require('./routes/auth');
const UserRoutes = require('./routes/users');
const ResourceRoutes = require('./routes/resources');
const CommentRoutes = require('./routes/comments');
const { urlencoded } = require('body-parser');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {
    const mongoose = require('mongoose');
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('DB is OK'))
        .catch(() => console.log('DB failed'));

    app.use(express.json());
    app.use(urlencoded({extended: true}));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use('/auth', AuthRoutes);
    app.use('/users', UserRoutes);
    app.use('/comments', CommentRoutes);
    app.use('/resources', ResourceRoutes);
}