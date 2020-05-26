
const Pool = require("pg").Pool;

const pool = new Pool ({
    user:"postgres",
    password:"11111",
    host:"database",
    port:5432,
    database: "mande"

});

module.exports = pool;
