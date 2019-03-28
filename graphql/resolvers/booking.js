const Booking = require('../../models/booking')
const { transformBooking, transformEvent } = require('./merge')

module.exports = {
       bookings: async () => {
        try{
            const bookings = Booking.find()
            return bookings.map( booking => {
                return transformBooking(booking)
            })
        }catch(err){
            throw err
        }
    },

    cancelBooking: async args => {
        try{
            const booking = await Booking.findOne(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({_id: args.bookingId})
            return event
        }catch(err){
            throw err
        }
    }
}