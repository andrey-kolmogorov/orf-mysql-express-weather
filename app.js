var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const dbConfig = require("./config/db.config");

const connection = require('./helpers/connection');
const query = require('./helpers/query');
const app = express();

// parse requests of content-type: application/json
app.use(cors());

app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Node.js application." });
});


app.get('/weather', async (req, res) => {
    var param_string = ""
    req.query.param.split(';').forEach(function(entry) {
        param_string += `GROUP_CONCAT(if(id_parameter=${entry},value,NULL) ) AS 'par_${entry}',`
    });
    var param_trimmed = param_string.substr(0, param_string.length-1)
    var basic_query = `SELECT ${param_trimmed}
    FROM t_data_mos WHERE id_stat = ${req.query.stat} AND dtg = '${req.query.tag}'`
    const conn = await connection(dbConfig).catch(e => {}) 
    const forecast = await query(conn, basic_query).catch(console.log);
    res.json({ forecast });

  })

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
