const {Sequelize} = require("sequelize")

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_LOGIN, process.env.DB_PASSWORD, {host: process.env.DB_HOST, dialect: "mysql"})

try {
    sequelize.authenticate();
} catch(error) {
    console.error("Error ", error)
}

module.exports = {sequelize}