// App requirements
const express = require('express');
const bodyParser = require('body-parser');

// Declare app as an Express project
const app = express();

// Setup views to load pug templates
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

// Load static assets
app.use('/static', express.static('stylesheets'));

// Load routes
const routes = require('./js/routes');
app.use(routes);

// Error handling route if no route is found
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});
  
module.exports = app;