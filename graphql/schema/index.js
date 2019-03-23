const {buildSchema} = require('graphql')

module.exports = buildSchema(`
type Booking {
    _id: ID
    event: Event!
    user: User!
    createdAt: String!
    updateAt: String!
}

type Event {
    _id: ID!
    tittle: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

type User{
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

input UserInput{
    email: String!
    password: String!
}

input EventInput {
    tittle: String!
    description: String!
    price: Float!
    date: String!
}

type RootQuery {
    events: [Event!]!
    users: [User!]!
    bookings: [Booking!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookingEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema{
    query: RootQuery
    mutation: RootMutation
}
`)