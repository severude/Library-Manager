// Routing declarations
const express = require('express');
const router = express.Router();

// Render home page route
router.get('/', (req, res) => {
    res.render('home');
});
router.get('/all_books', (req, res) => {
    res.render('all_books');
});
router.get('/all_loans', (req, res) => {
    res.render('all_loans');
});
router.get('/all_patrons', (req, res) => {
    res.render('all_patrons');
});
router.get('/new_book', (req, res) => {
    res.render('new_book');
});
router.get('/overdue_books', (req, res) => {
    res.render('overdue_books');
});
router.get('/checked_books', (req, res) => {
    res.render('checked_books');
});
router.get('/new_patron', (req, res) => {
    res.render('new_patron');
});
router.get('/new_loan', (req, res) => {
    res.render('new_loan');
});
router.get('/overdue_loans', (req, res) => {
    res.render('overdue_loans');
});
router.get('/checked_loans', (req, res) => {
    res.render('checked_loans');
});
router.get('/book_detail', (req, res) => {
    res.render('book_detail');
});
router.get('/return_book', (req, res) => {
    res.render('return_book');
});
router.get('/patron_detail', (req, res) => {
    res.render('patron_detail');
});

module.exports = router;
