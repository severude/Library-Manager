// Routing declarations
const express = require('express');
const router = express.Router();
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;

// Patron routes

// Show all patrons
router.get('/', (req, res) => {
    Patron.findAll().then(patrons => {
        res.render('all_patrons', {patrons});
    }).catch(err => {
        res.status(500);
    });
});

// Show form for new patron
router.get('/new_patron', (req, res) => {
    res.render('new_patron', {
        patron: Patron.build(req.body)
    });
});

// Post new patron and redirect to patrons page
router.post('/new_patron', (req, res) => {
    Patron.create(req.body).then(() => {
        res.redirect('/patrons');
    }).catch(err => {
        if(err.name === "SequelizeValidationError") {
            res.render("new_patron", {
              patron: Patron.build(req.body),
              errors: err.errors
            });
          } else {
            throw err;
          }
    }).catch(err => {
        res.status(500);
    });
});

// Show individual patron detail
router.get('/patron_detail/:id', (req, res) => {
    Patron.findById(req.params.id)
    .then(patron => {
        Loan.findAll({
            include: [
                {model: Book},
                {model: Patron}
            ],
            where: {
                patron_id: req.params.id
            }
        }).then(loans => {
            res.render('patron_detail', {patron, loans});
        })
    })
});

// Update individual patron detail
router.put('/patron_detail/:id', (req, res, next) => {
    Patron.findById(req.params.id)
    .then(patron => patron.update(req.body))
    .then(() => res.redirect('/patrons'))
    .catch(err => {
        if(err.name === "SequelizeValidationError") {
            Patron.findById(req.params.id)
            .then(patron => {
                Loan.findAll({
                    include: [
                        {model: Book},
                        {model: Patron}
                    ],
                    where: {
                        patron_id: req.params.id
                    }
                }).then(loans => {
                    res.render('patron_detail', {patron, loans, errors:err.errors});
                })
            })
                } else {
            throw(err);
        }
    });
});

module.exports = router;