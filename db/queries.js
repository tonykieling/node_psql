require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

const getUsers = (request, response) => {
console.log("inside getUsers");
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows);
  });
}

const getUserByName = (req, res) => {
  console.log("inside getUsersByName");
  const name = req.query.name;
  pool.query('SELECT * FROM users WHERE name = $1', [name], (error, result) => {
    if (error)
      throw error;
    if (result.rows.length) {
      res.status(200).json(result.rows);
      return;
    }
    else {
      res.send("No user");
      return;
    }
  });
}

const getUserByEmail = async email => {
  console.log("inside getUsersByEmail");
  return new Promise((res, rej) => {
    try {
      pool.query('SELECT * FROM users WHERE email = $1', [email], (error, result) => {
        // if (!!(result.rows.length)) {
          // console.log("id: ", result.rows[0].id);
          // throw new Error(error);     //////////////////////////just in case to tes catch/error
          // throw "err";
        //   res(result.rows[0].id);
        // } else {
          // console.log(result.rows[0].id);
        //   res(false);
        // }
        (result.rows.length) ? res(result.rows[0].id) : res(false);
        // return((result.rows[0].id) ? (result.rows[0].id) : (false));
      });
    } catch (err) {
      console.log("Error message: ", err.message);
      rej("ERR");
      return;
    }
  })
}

const createUser = async (req, res) => {
  console.log("inside createUser");
  const user = req.body
  const emailExist = await getUserByEmail(user.email)
  try {
    if (!emailExist) {
      pool.query('INSERT INTO users (name, email, userActive, userAdmin) VALUES ($1, $2, true, $3)',
      [user.name, user.email, false], (error, result) => {
      if (error) {
        res.send("something wrong, please try again");
        throw error;
      }
      res.send(`user ${user.email} has been created successfully`);
    });
    } else
      res.send(`user ${user.email} already exists`);
    return;
  } catch (err) {
    console.log("err message at updateUser");
    res.send("Something bad has happened. Please, try it again");
    return;
  }
}

const deactivateUser = async (req, res) => {
  console.log("inside deactivateUser");
  const user = req.body;
  const userIdDB = await getUserByEmail(user.email);
  if (userIdDB) {
    pool.query('UPDATE users SET useractive = $1 WHERE id = $2', [false, userIdDB]);
    res.send(`user ${user.email} has been updated`);
    return;
  } else 
    res.send("No user to 'delete', actually, deactivate");
    return;
}

const updateUser = async (req, res) => {
  console.log("inside updateUser");
  const user = req.body;
  try {
    const userIdDB = await getUserByEmail(user.actual);
    if (userIdDB) {
      pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [user.name, user.email, userIdDB]);
      res.send(`user ${user.email} has been updated`);
      return;
    } else 
      res.send("No user to update");
      return;
  } catch (err) {
    console.log("err message at updateUser");
    res.send("Something bad has happened. Please, try it again");
    return;
  }
}

const grantAdminPermission = async (req, res) => {
  console.log("inside grantAdminPersission");  
  const user = req.body;
  const userIdDB = await getUserByEmail(user.email);
  try {
    if (userIdDB) {
      pool.query('UPDATE users SET useradmin = $1 WHERE id = $2', [true, userIdDB]);
      res.send(`user ${user.email} has been granted admin permission`);
    } else 
      res.send("No user to grant permission");
    return;
  } catch (err) {
    console.log("err message at grantAdminPermission");
    res.send("Something bad has happened. Please, try it again");
    return;
  }

}

module.exports = {
  getUsers,
  getUserByName,
  createUser,
  deactivateUser,
  updateUser,
  grantAdminPermission
}