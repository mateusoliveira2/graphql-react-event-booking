const Event = require('../../models/event')
const { transformEvent} = require('./merge')

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return transformEvent(event)
                })
            })
            .catch(err => {
                throw err
            })
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
                createdEvent = transformEvent(result)
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
    }
}