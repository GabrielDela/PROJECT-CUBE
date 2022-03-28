require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const AuthRoutes = require('./routes/auth');
const UserRoutes = require('./routes/users');
const ResourceRoutes = require('./routes/resources');
const CommentRoutes = require('./routes/comments');
const CategoryRoutes = require('./routes/categories');
const TypeRoutes = require('./routes/types');
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
    app.use(bodyParser({limit: '50000mb'}));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use('/api/auth', AuthRoutes);
    app.use('/api/users', UserRoutes);
    app.use('/api/comments', CommentRoutes);
    app.use('/api/resources', ResourceRoutes);
    app.use('/api/categories', CategoryRoutes);
    app.use('/api/types', TypeRoutes);
}