// App requirements
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Declare app as an Express project
const app = express();

// Setup views to load pug templates
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

// Load static assets
app.use('/static', express.static('stylesheets'));

// Load routes
const index = require('./routes/index');
const books = require('./routes/books');
const patrons = require('./routes/patrons');
const loans = require('./routes/loans');
app.use('/', index);
app.use('/books', books);
app.use('/patrons', patrons);
app.use('/loans', loans);

// Error handling route if no route is found
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('not_found');
});
  
module.exports = app;