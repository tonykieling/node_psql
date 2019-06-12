// import express from ('express')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// const knex = require('./db/knex.js');
const dbQueries = require('./db/queries.js')

const PORT = 3333

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// const usersRoutes = require('./temp.js')
// app.use("/api/users", usersRoutes(knex));

// route to /
app.get("/", (req, res) => res.send("this is '/'\nnewline"))

// generic query to the users
app.get("/users", dbQueries.getUsers)

// query users by name
app.get("/user", dbQueries.getUserByName)

// creates user
app.post("/user", dbQueries.createUser)

// delete users (actually, deactivate them)
app.delete("/user", dbQueries.deactivateUser)

// update user info
app.put("/user", dbQueries.updateUser)

// grant userAdmin permission
app.put("/useradmin", dbQueries.grantAdminPermission)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})