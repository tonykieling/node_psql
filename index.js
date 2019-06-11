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

app.get("/", (req, res) => {
  res.send("this is '/'\nnewline")
})

app.get("/users", dbQueries.getUsers)
app.get("/user", dbQueries.getUserByName)

app.post("/user", dbQueries.createUser)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})