const {Sequelize} = require("sequelize")

const sequelize = new Sequelize("maptheonDB", "root", "", {host: "localhost", dialect: "mysql"})

try {
    sequelize.authenticate();
} catch(error) {
    console.error("Error ", error)
}

module.exports = {sequelize}