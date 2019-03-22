const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
//gerar graphql schema obj baseado no meu schema
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const Event = require('./models/event')

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

        input EventInput {
            tittle: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
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
