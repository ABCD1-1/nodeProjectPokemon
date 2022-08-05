const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
  app.get('/api/pokemons', auth, (req, res) => {    //we can add a middleware in the 2nd argument in the declaration of a new route
    if(req.query.name) {
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5   //5 y default if no value in req.query.limit

      if(name.length < 2) {
        const message = "Le terme de recherche doit contenir au moins 2 caractères."
        return res.status(400).json({message})
      }

      return Pokemon.findAndCountAll({
      where: {
        name: {  // 'name' is the propriety of the pokemon model
          [Op.like]: `%${name}%` // 'name' is the research criterium
        }
      },
      order: ['name'],
      limit: limit
    })
      .then(({count, rows}) => {    // count and rows are variables return by findAndCountAll
        const message = `Il y a ${count} pokémons qui correspondent à vos recherches ${name}.`
        res.json({message, data: rows})
      })
    } else {
    Pokemon.findAll({order: ['name']})
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = "La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants."
        res.status(500).json({message, data: error})
      })
    }

  })
}









