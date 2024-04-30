const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("maptheon", "root", "", {host: "localhost", dialect: "mysql"})

try {
    sequelize.authenticate();
} catch(error) {
    console.error("Error ", error)
}

module.exports = {sequelize}