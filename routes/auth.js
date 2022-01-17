const { requireAuth, requireAnon, unsetAuthToken } = require("../helpers/auth")
const { User, Schedule } = require('../models');

const express = require('express');
const router = express.Router();

router.get('/login', requireAnon, (req, res) => {
    res.render('login');
});

router.post('/login', requireAnon, (req, res) => {
    const { email, password } = req.body;

    User.authenticate(email, password, res)
        .then(_ => { res.redirect('/') })
        .catch(msg => { 
            res.render('login', {
                messageClass: 'alert-danger',
                message: msg 
            }) 
        });
});

router.get('/logout', requireAuth, (req, res) => {
    unsetAuthToken(req, res);
    res.redirect('/');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    User.new(req.body)
        .then(_ => {
            res.render('login', {
                messageClass: 'alert-success',
                message: 'Registration Complete. Please login to continue.'
            })
        }).catch(msg => { 
            res.render('signup', {
                messageClass: 'alert-danger',
                message: msg
            }) 
        })
});

module.exports = router;
