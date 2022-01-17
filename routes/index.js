const { requireAuth } = require("../helpers/auth")
const { User, Room, Slot, Booking, Player } = require('../models');

const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    Room.findAll({raw : true})
        .then(rooms => { res.render('home', { rooms }) })
        .catch(msg => { 
            res.render('home', { 
                messageClass: 'alert-danger', 
                message: msg 
            }) 
        })
});

router.get('/room/:id', (req, res) => {
  const { id } = req.params;

  Room.findOne({ where: { id }, raw: true })
    .then(async (roomData) => { 
        const slots = await Slot.findAll({ where: { roomId: id, "$Users->Booking.userId$": null }, include: [{ model: User }], raw: true, nest:true})
            
        console.log(slots)
        res.render('room', { roomData, slots }) 
    })
    .catch(err => { res.status(404).send(err) })
});

router.get('/slot/:id/book', requireAuth, (req, res) => {
  const { id } = req.params;

  Slot.findOne({ where: { id }, include: 'room', raw: true, nest: true })
        .then(slot => { res.render('book', { slot }) })
        .catch(err => { res.status(404).send(err) })
});

router.post('/slot/:id/book', requireAuth, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ where: { id: req.user } })

    Slot.findOne({ where: { id } })
        .then(slot => { 
            user.bookSlot(slot, req.body.players)
                .then(_ => { res.redirect('/bookings') })
                .catch(err => { console.error(err) })            
        })
        .catch(err => { res.status(404).send(err) })
});

router.get('/bookings', requireAuth, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user } })
    const slots = await user.getSlots({ raw: true, nest: true });
    for (let slot of slots) {
        slot.players = await Player.findAll({ where: { bookingId : slot.Booking.id }, raw: true, nest: true});
    }
    
    res.render('bookings', { slots }) 
});

// router.post('/schedule', requireAuth, (req, res) => {
//     Schedule.create(req.user, req.body)
//         .then(_ => { res.redirect("/schedule") })
//         .catch(msg => { 
//             res.render('schedule', { 
//                 messageClass: 'alert-danger', 
//                 message: msg 
//             }) 
//         })
// });

module.exports = router;