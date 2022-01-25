const { requireAuth, requireAdmin } = require('../helpers/auth');
const { User, Room, Slot, Booking, Player } = require('../models');
const { Op, where } = require('sequelize');

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    Room.findAll({ raw: true })
        .then((rooms) => {
            res.render('home', { rooms });
        })
        .catch((msg) => {
            res.render('home', {
                messageClass: 'alert-danger',
                message: msg,
            });
        });
});

router.get('/room/:id', (req, res) => {
    const { id } = req.params;

    Room.findOne({ where: { id }, raw: true })
        .then(async (roomData) => {
            const slots = await Slot.findAll({ where: { roomId: id, '$Users->Booking.userId$': null, during: { [Op.contained]: [new Date(), Infinity] } }, include: [{ model: User }], raw: true, nest: true });
            console.log(new Date().toString());
            res.render('room', { roomData, slots });
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});

router.get('/slot/:id/book', requireAuth, (req, res) => {
    const { id } = req.params;

    Slot.findOne({ where: { id }, include: 'room', raw: true, nest: true })
        .then((slot) => {
            res.render('book', { slot });
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});

router.post('/slot/:id/book', requireAuth, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { id: req.user } });

    Slot.findOne({ where: { id }, include: 'room', raw: true, nest: true })
        .then((slot) => {
            user.bookSlot(slot, req.body.players)
                .then((_) => {
                    if (_) {
                        let queryString = _.join('-');
                        res.redirect('/bookings/?ageCheck=' + queryString);
                    } else {
                        res.redirect('/bookings');
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});

router.get('/bookings', requireAuth, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user } });
    const slots = await user.getSlots({ raw: true, nest: true });
    for (let slot of slots) {
        slot.players = await Player.findAll({ where: { bookingId: slot.Booking.id }, raw: true, nest: true });
    }

    res.render('bookings', { slots });
});
router.post('/bookings', requireAuth, async (req, res) => {
    await Booking.destroy({ where: { slotId: req.body.bookingId } });
    res.send('Nice');
});

router.post('/get-current-user', requireAuth, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user } });
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
    });
});
router.get('/admin', requireAdmin, async (req, res) => {
    const rooms = await Room.findAll({ raw: true });
    const slots = await Slot.findAll({ raw: true });
    const bookings = await Booking.findAll({ raw: true });
    console.log(rooms);
    console.log(slots);
    console.log(bookings);
    res.render('admin', {
        rooms,
        slots,
        bookings,
    });
});

router.get('/admin/edit/room/:id/', requireAdmin, async (req, res) => {
    const room = await Room.findOne({ where: { id: req.params.id }, raw: true, nest: true, include: { model: Slot, as: 'slots', include: { model: User, as: 'users' } } });
    console.log(JSON.stringify(room, null, 2));
    res.render('adminRoomEditing', { room });
});

module.exports = router;
