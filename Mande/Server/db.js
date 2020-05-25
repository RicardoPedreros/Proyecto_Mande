
const Pool = require("pg").Pool;

const pool = new Pool ({
    user:"postgres",
    password:"11111",
    host:"localhost", // cambiar a "database" cuando se haga deploy con docker-compose
    //host:"172.17.0.1", //  cambiar a "database" cuando se haga deploy con docker-compose
    port:5432,
    database: "mande"

});

module.exports = pool;
