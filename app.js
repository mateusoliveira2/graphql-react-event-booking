const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const bcrypt = require('bcryptjs')

//gerar graphql schema obj baseado no meu schema
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/event')
const User = require('./models/user')
const app = express()

app.use(bodyParser.json())

app.use('/graphql',graphqlHttp({
    //! depois do tipo quer dizer que todo evento tem q ter um ID, nunca vai ser  nulo
    schema: buildSchema(`
        type Event {
            _id: ID!
            tittle: String!
            description: String!
            price: Float!
            date: String!
        }

        type User{
            _id: ID!
            email: String!
            password: String
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
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return {...event._doc, _id: event._doc._id.toString()}
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
                date: new Date(args.eventInput.date)
            })
            return event
                .save()
                .then(result => {
                    console.log(result)
                    return {...result._doc};
                }).catch(err => {
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
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://mateus:ihGTQpnsPGJCIyIw@cluster0-e1msh.mongodb.net/events-react-dev?retryWrites=true`
                )
                .then( () => {
                    app.listen(3000)
                }).catch(err => {
                    console.log(err, "deu merda na conexao")
                })

/*mongoose.connect(`mongodb+srv://
                ${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
                }@cluster0-e1msh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
                )
                .then( () => {
                    app.listen(3000)
                }).catch(err => {
                    console.log(err, "deu merda na conexao")
                })
*/
