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
    res.status(200).json(result.rows)
  })
}

const getUserByEmail = email => {  
  return new Promise((res, rej) => {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
      console.log("result.rows.length == ", result.rows.length)
      // console.log("typeof result: ", typeof result.rows)
      // console.log("+++ ", Object.keys(result.rows).length)
      console.log(!result.rows.length)
      if (result.rows.length) {
        res(true)
      } else {
        res(false)
      }
      // (Object.keys(result).length > 0) ? res(true) : res(false)
    })
    })
}

const createUser = (req, res) => {
  const user = req.body
  // console.log(`user = ${JSON.stringify(user)}`)
  if (!getUserByEmail(user.email)) {
    pool.query('INSERT INTO users (name, email, userAdmin) VALUES ($1, $2, $3)',
      [user.name, user.email, false], (error, result) => {
      if (error) {
        res.send("something wrong, please try again")
        throw error
      }
      res.send(`user ${user.email} has been created successfully`)
    })
  } else
    res.send(`user ${user.email} already exist`)

}

module.exports = {
  getUsers,
  getUserByName,
  createUser
}