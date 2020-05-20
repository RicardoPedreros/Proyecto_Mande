
const Pool = require("pg").Pool;

const pool = new Pool ({
    user:"postgres",
    password:"11111",
    host:"localhost",
    port:5433,
    database: "mande"

});

module.exports = pool;