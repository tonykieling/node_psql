require('dotenv').config();
const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

const getUsers = (request, response) => {
console.log("getUsers function");
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  });
}

const getUserByName = (req, res) => {
  const name = req.query.name;
  pool.query('SELECT * FROM users WHERE name = $1', [name], (error, result) => {
    if (error)
      throw error
    if (result.rows.length)
      res.status(200).json(result.rows)
    else
      res.send("No user")
    
  });
}

const getUserByEmail = email => {
  console.log("email is ", email);
  // email += " "
  return new Promise((res, rej) => {
    try {
      // pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        // if (!!(result.rows.length)) {
          // console.log("id: ", result.rows[0].id);
          // error = "ERRRRRRRRRRRRRRRRRRR"
          throw new Error('Required');
          // throw "myerror"
        //   res(result.rows[0].id)
        // } else {
        //   console.log("result.rows[0].id")
        //   res(false)
        // }
        // (result.rows.length) ? res(result.rows[0].id) : res(false);
      // })
    } catch (err) {
      console.log("MSG: ", err.message);
      res("ERR");
    }
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
  if (userIdDB) {
    pool.query('UPDATE users SET useractive = $1 WHERE id = $2', [false, userIdDB])
    res.send(`user ${user.email} has been updated`)
  } else 
    res.send("No user to 'delete', actually, deactivate")
}

const updateUser = async (req, res) => {
  const user = req.body
  console.log("user", JSON.stringify(user))
    try {
const userIdDB = await getUserByEmail(user.actual)
if (userIdDB == "ERR") {
  console.log("ERRRRRRRRRRR")
  res.send("Something bad has happened. Please, try again")
    }
    if (userIdDB) {
      pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [user.name, user.email, userIdDB])
      res.send(`user ${user.email} has been updated`)
    } else 
      res.send("No user to update")
  } catch (err) {
    res.send("Something bad has happened. Please, try again")
  }
}

const grantAdminPermission = async (req, res) => {
  const user = req.body
  const userIdDB = await getUserByEmail(user.email)
  if (userIdDB) {
    pool.query('UPDATE users SET useradmin = $1 WHERE id = $2', [true, userIdDB])
    res.send(`user ${user.email} has been granted admin permission`)
  } else 
    res.send("No user to grant permission")
}

module.exports = {
  getUsers,
  getUserByName,
  createUser,
  deactivateUser,
  updateUser,
  grantAdminPermission
}