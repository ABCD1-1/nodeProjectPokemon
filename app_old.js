const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')   // body-parser is a middleware 
const {Sequelize, DataTypes} = require('sequelize')
const favicon = require('serve-favicon')
const {success, getUniqueId} = require('./helper')
let pokemons = require('./src/db/mock-pokemon')
const PokemonModel = require('./src/models/pokemon')
const pokemon = require('./src/models/pokemon')

const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',   // driver's name that we use to allow sequalize to interact with the database, //warning, actually is connecting to MySQL database...
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

const Pokemon = PokemonModel(sequelize, DataTypes)
sequelize.sync({force: true})   //force: true (useful during development)= to remove everything in the database each time we reset our API Rest
    .then(_ => {
        console.log('La base de données "Pokedex" a bien été synchronisée.')
        
        pokemons.map(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types.join()   // .join() to generate a string that can be saved in database
            }).then(bulbizzare => console.log(bulbizzare.toJSON()))
        })

    }
    )

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))


// middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())  // to convert string to JSON


// example middleware
// app.use((req, res, next) => {
//     console.log(`URL: ${req.url}`)
//     next()
// })

app.get('/', (req, res) => res.send('Hello, Express !'))

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    // res.json(pokemon)
    const message = 'Un pokémon a bien été trouvé'
    res.json(success(message, pokemon))
})

app.get('/api/pokemons', (req, res) => {
    // res.send(`Il y a ${pokemons.length} pokémons au total pour le moment.`)
    const message = `La liste des pokémons a bien été récupérée.`
    res.json(success(message, pokemons))
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    //pb below, the body is a string and not a JSON
    // Notice: when data are transfered from HTTP, they can only be on string type
    // So when it arrives att API Rest, it gets string instead of JSON
    // We need to transform string to JSON
    // 1) We can parse a string to JSON with JSON.parse(".....")
    // 2) We can use middleware to do this
    const pokemonCreated = {...req.body, ...{id:id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été créé.`
    res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = {...req.body, id:id}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié`
    res.json(success(message, pokemonUpdated))
})

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)  // delete the pokemon associated to the id
    const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
})



app.listen(port, () => console.log(`Notre application Node est démarée sur : http://localhost:${port}`))













