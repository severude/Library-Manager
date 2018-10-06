// Routing declarations
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Book = require("../models").Book;
const Loan = require("../models").Loan;
const Patron = require("../models").Patron;
let limit = 3;  // Default page limit

// Patron routes

// Show all patrons
router.get('/', (req, res) => {
    res.redirect('/patrons/page-1');
});

// Show all patrons with paging
router.get('/page-:page', (req, res) => {
    Patron.findAndCountAll().then(patrons => {
        let activePage = req.params.page;
        let totalPages = Math.ceil(patrons.count / limit);
        let offset = limit * (activePage - 1);
        let pages = [];
        for(let index = 1; index <= totalPages; index++) {
            pages.push(index);
        }
        Patron.findAll({
            limit: limit,
            offset: offset
        })
        .then(patrons => {
            res.render('all_patrons', {patrons, activePage, pages});
        })
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

// Show patron search results
router.post('/search', (req, res, next) => {
    const {search} = req.body;
    Patron.findAll({
        where: {
            [Op.or]: [
                {
                    first_name: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    last_name: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    address: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    email: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    library_id: { 
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    zip_code: { 
                        [Op.like]: `%${search}%`
                    }
                }
            ]
        }
    }).then(patrons => {
        res.render('search_patrons', {patrons, search});
    }).catch(err => {
        res.status(500);
    });
});

module.exports = router;
