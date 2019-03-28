const Event = require('../../models/event')
const User = require('../../models/user')


const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator) 
    }
}

const singleEvent = async eventId => {
    try{
        const event = await Event.findOne(eventId)
        return transformEvent(event)
    }catch(err){
        throw err
    }
}

const events =async eventsIds => {
    try{
        const events = await Event.find({_id: {$in: eventsIds}})
        return events.map( event => {
            return transformEvent(event)
        })
    }catch(err){
        throw err
    }
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

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking._docs._id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updateAt: new Date(booking._doc.updateAt).toISOString()
    }
}

exports.transformEvent = transformEvent
exports.transformBooking = transformBooking

