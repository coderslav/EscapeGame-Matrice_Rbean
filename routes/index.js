const { requireAuth, requireAdmin } = require('../helpers/auth');
const { User, Room, Slot, Booking, Player } = require('../models');
const { Op, where } = require('sequelize');

const express = require('express');
const read = require('body-parser/lib/read');
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
    res.send('Done!');
});

router.post('/get-current-user', requireAuth, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user } });
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
    });
});
router.get('/admin', requireAdmin, async (req, res) => {
    const rooms = JSON.parse(JSON.stringify(await Room.findAll({ include: { all: true, nested: true } })));
    res.render('admin', {
        rooms,
    });
});

router.get('/admin/edit/room/:id/', requireAdmin, async (req, res) => {
    const room = JSON.parse(JSON.stringify(await Room.findOne({ where: { id: req.params.id }, include: { all: true, nested: true } })));
    console.log(room);
    res.render('adminRoomEditing', { room });
});
router.post('/admin/edit/room/:id/', requireAdmin, async (req, res) => {
    console.log(req.body);
    if (req.body.slotId) {
        req.body.during = [new Date(req.body.timeFrom), new Date(req.body.timeTo)];
        let slotId = req.body.slotId;
        delete req.body.timeFrom;
        delete req.body.timeTo;
        delete req.body.slotId;
        await Slot.update(req.body, { where: { id: slotId }, returning: true, plain: true, raw: true }).then((result) => {
            console.log(result[1]);
            res.json(result[1]);
        });
    } else if (req.body.deleteSlot) {
        await Slot.destroy({ where: { id: req.body.deleteSlot } });
        res.send('Done!');
    } else if (req.body.roomId) {
        await Slot.create({ during: [new Date(req.body.timeFrom), new Date(req.body.timeTo)], roomId: req.body.roomId }, { raw: true }).then((newSlot) => {
            res.json(newSlot);
        });
    } else {
        let bodyObjectKeys = Object.keys(req.body);
        if (bodyObjectKeys.length > 0) {
            for (let index = 0; index < bodyObjectKeys.length; index++) {
                if (!req.body[bodyObjectKeys[index]]) {
                    delete req.body[bodyObjectKeys[index]];
                }
            }
            if (req.body.capacityFrom || req.body.capacityTo) {
                req.body.capacity = [req.body.capacityFrom, req.body.capacityTo];
                delete req.body.capacityFrom;
                delete req.body.capacityTo;
            }
            await Room.update(req.body, { where: { id: req.params.id } });
            let newRoom = JSON.parse(JSON.stringify(await Room.findOne({ where: { id: req.params.id }, include: { all: true, nested: true } })));
            res.render('adminRoomEditing', {
                room: newRoom,
                messageClass: 'alert-success',
                message: 'Done!',
            });
        } else {
            res.redirect(`/admin/edit/room/${req.params.id}/`);
        }
    }
});

module.exports = router;
