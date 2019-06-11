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
  console.log("email: ", email)
  return new Promise((res, rej) => {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
      // if (!!(result.rows.length)) {
      //   res(true)
      // } else {
      //   res(false)
      // }
      (result.rows.length) ? res(true) : res(false)
    })
    })
}

const createUser = async (req, res) => {
  const user = req.body
  const emailExist = await getUserByEmail(user.email)
  if (!emailExist) {
    // console.log("all rigth")
    // res.send("it supposed to be added")
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