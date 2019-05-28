const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
//gerar graphql schema obj baseado no meu schema
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const graphQLSchema = require('./graphql/schema/index')
const graphQLResolvers = require('./graphql/resolvers/index')
const app = express()

app.use(bodyParser.json())

app.use('/graphql',graphqlHttp({
    //! depois do tipo quer dizer que todo evento tem q ter um ID, nunca vai ser  nulo
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
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
