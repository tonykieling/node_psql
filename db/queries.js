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
  pool.query('SELECT * FROM users WHERE name = $1', [name], (error, result) => {
    if (error)
      throw error
    if (result.rows.length)
      res.status(200).json(result.rows)
    else
      res.send("No user")
    
  })
}

const getUserByEmail = email => {  
  return new Promise((res, rej) => {
    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
      // console.log(result.rows[0].id)
      // if (!!(result.rows.length)) {
        // res(true)
      // } else {
      //   res(false)
      // }
      (result.rows.length) ? res(result.rows[0].id) : res(false)
    })
    })
}

const createUser = async (req, res) => {
  const user = req.body
  const emailExist = await getUserByEmail(user.email)
  if (!emailExist) {
    pool.query('INSERT INTO users (name, email, userActive, userAdmin) VALUES ($1, $2, true, $3)',
      [user.name, user.email, false], (error, result) => {
      if (error) {
        res.send("something wrong, please try again")
        throw error
      }
      res.send(`user ${user.email} has been created successfully`)
    })
  } else
    res.send(`user ${user.email} already exists`)
}

const deactivateUser = async (req, res) => {
  const user = req.body
  const userIdDB = await getUserByEmail(user.email)
  console.log("userid: ", userIdDB)
  console.log("user: ", JSON.stringify(user))
  if (userIdDB) {
    pool.query('UPDATE users SET useractive = $1 WHERE id = $2', [false, userIdDB])
    res.send(`user ${user.email} has been updated`)
  } else 
    res.send("No user to 'delete', actually, deactivate")
}



module.exports = {
  getUsers,
  getUserByName,
  createUser,
  deactivateUser
}