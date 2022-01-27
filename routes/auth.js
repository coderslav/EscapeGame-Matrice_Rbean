const { requireAuth, requireAnon, unsetAuthToken } = require('../helpers/auth');
const { User, Room } = require('../models');

const express = require('express');
const router = express.Router();

router.get('/login', requireAnon, (req, res) => {
    res.render('login');
});

router.post('/login', requireAnon, async (req, res) => {
    const { email, password } = req.body;

    User.authenticate(email, password, res)
        .then((userData) => {
            Room.findAll({ raw: true }).then((rooms) => {
                res.render('home', {
                    rooms,
                    messageClass: 'alert-success',
                    message: `Bonjour, ${userData.firstName}!`,
                    user: userData.user,
                    isAdmin: userData.isAdmin,
                    username: userData.firstName,
                });
            });
        })
        .catch((msg) => {
            res.render('login', {
                messageClass: 'alert-danger',
                message: msg,
            });
        });
});

router.get('/logout', requireAuth, async (req, res) => {
    unsetAuthToken(req, res);
    res.redirect('/');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    console.log(req.body);
    User.new(req.body)
        .then((_) => {
            res.render('login', {
                messageClass: 'alert-success',
                message: 'Registration Complete. Please login to continue.',
            });
        })
        .catch((msg) => {
            res.render('signup', {
                messageClass: 'alert-danger',
                message: msg,
            });
        });
});

module.exports = router;
