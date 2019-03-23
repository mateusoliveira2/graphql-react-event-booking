const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')
const bcrypt = require('bcryptjs')

const singleEvent = eventId => {
    try{
        const event = await Event.findOne(eventId)
        return{
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }

    }catch(err){
        throw err
    }
}

const events = eventsIds => {
    return Event.find({_id: {$in: eventsIds}})
        .then(events => {
            return events.map( event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator) }
            })
        })
        .catch(err => {
            throw err
        })
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user._doc.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
        throw err
    })
}

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event._doc._id.toString(),
                        creator: user.bind(this, event._doc.creator)
                    
                    }
                })
            })
            .catch(err => {
                throw err
            })
    },
    //modelo que todos deveriam seguir
    bookings: async () => {
        try{
            const bookings = Booking.find()
            return bookings.map( booking => {
                return {
                    ...booking._doc,
                    _id: booking._docs._id,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updateAt: new Date(booking._doc.updateAt).toISOString()
                }
            })
        }catch(err){
            throw err
        }
    },
    createEvent: (args) => {
        //cria e salva evento
        const event = new Event({
            tittle: args.eventInput.tittle,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            //ID
            creator: ''
        })
        let createdEvent;
        return event
            .save()
            .then(result => {
                createdEvent = {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
                }
                //ID
                return User.findById('');
            })
            .then(user => {
                if(!user){
                    throw new Error ('User not found')
                }
                user.createdEvents.push(event)
                return user.save()
            })
            .then(result => {
                return createdEvent
            })
            .catch(err => {
                console.log(err)
                throw err
            });
    },

    createUser: (args) => {
        return User.findOne({email: args.userInput.email})
            .then(user => {
                if(user){
                    throw new Error('User already exist.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: args.userInput.password
                })
                return user.save()
            })
            .then(result =>{
                return {...result._doc, _id: result.id}
            })
            .catch(err => {
                throw err
            })
    },
    bookingEvent: async args => {
        const fetchEvent = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
            user: '',
            event: fetchEvent
        })

        const result = await booking.save()
        return{
            ...result._doc,
            _id: result.id,
            user: user.bind(this, booking._doc.user),
            event: singleEvent.bind(this, booking._doc.event),
            createdAt: new Date(event._doc.createdAt).toISOString(),
            updateAt: new Date(event._doc.updateAt).toISOString()
        }
    },
    cancelBooking: async args => {
        try{
            const booking = await Booking.findOne(args.bookingId).populate('event')
            const event = {
                ...booking.event._doc,
                _id: booking.id,
                creator: user.bind(this, booking.event._doc.creator)
            }
            await Booking.deleteOne({_id: args.bookingId})
            return event
        }catch(err){
            throw err
        }
    }
}