const { application } = require('express')
const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')   // body-parser is a middleware 
const sequelize = require('./src/db/sequelize')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// middleware
app
    .use(favicon(__dirname + '/favicon.ico'))   
    .use(bodyParser.json())  // to convert string to JSON
    .use(cors())

// sequelize.initDb()


// Endpoints
app.get('/', (req, res) => {
    res.json('Hello, Heroku !')
})

// const findAllPokemons = require('./src/routes/findAllPokemons')
// findAllPokemons(app)
// the 2 previous lines are equivalent to the single line below
require('./src/routes/findAllPokemons')(app)
require('./src/routes/findPokemonByPk')(app)
require('./src/routes/createPokemon')(app)
require('./src/routes/updatePokemon')(app)
require('./src/routes/deletePokemon')(app)
require('./src/routes/login')(app)

////////////////////////////

app.listen(port, () => console.log(`Notre application Node est démarée sur : http://localhost:${port}`))













