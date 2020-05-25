
const Pool = require("pg").Pool;

const pool = new Pool ({
    user:"postgres",
    password:"11111",
<<<<<<< HEAD
    host:"localhost", // cambiar a "database" cuando se haga deploy con docker-compose
=======
    host:"172.17.0.1", //  cambiar a "database" cuando se haga deploy con docker-compose
>>>>>>> 9b02e361e702405c93cce7afceb97367c9c93313
    port:5432,
    database: "mande"

});

module.exports = pool;
