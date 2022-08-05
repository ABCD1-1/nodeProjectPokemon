const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {msg: "Ce nom est déjà pris"},
        validate: {
          notEmpty: {msg: "Name ne peut pas être vide."},
          notNull: {msg: "Name est une propriété requise."}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: "Utilisez uniquement des entiers pour les points de vie."},
          min: {
            args: [0],
            msg: "Les points de vie doivent être supérieurs ou égaux à 0."
          },
          max: {
            args: [999],
            msg: "Les points de vie doivent être inférieurs ou égaux à 999."
          },
          notNull: {msg: "Les points de vie sont une propriété requise."}
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: "Utilisez uniquement des entiers pour les points de dégats."},
          min: {
            args: [0],
            msg: "Les points de dégats doivent être supérieurs ou égaux à 0."
          },
          max: {
            args: [200],
            msg: "Les points de dégats doivent être inférieurs ou égaux à 200."
          },
          notNull: {msg: "Les points de dégats sont une propriété requise."}
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {msg: "Veuillez utiliser une url valide pour l'image."},
          notNull: {msg: "L'image est une propriété requise."}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue('types').split(',')
        },
        set(types) {
          this.setDataValue('types', types.join())
        },
        validate: {
          isTypesValid(value) {   //isTypesValid is a random name we have chosen
            if(!value) {
              throw new Error("Un pokémon doit au moins avoir un type.")
            }
            if(value.split(',').length > 3) {
              throw new Error("Un pokémon ne peut pas avoir plus de 3 types.")
            }
            value.split(',').forEach(type => {
              if(!validTypes.includes(type)){
                throw new Error(`Le type du pokémon doit appartenir à la liste suivante : ${validTypes}`)
              }
            })
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }