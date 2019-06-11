require('dotenv').config();
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
})

const getUsers = (request, response) => {
console.log("getUsers function")
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserByName = (req, res) => {
  const name = req.query.name
  console.log("inside getUserByName, user: ", name)
  // res.send(req.query)
  pool.query('SELECT * FROM users WHERE name = $1', [name], (error, result) => {
    if (error)
      throw error
    // console.log("result: ", (result.rows))
    res.status(200).json(result.rows)
  })
}

module.exports = {
  getUsers,
  getUserByName
}