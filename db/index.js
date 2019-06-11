import knex from ('knex')({
  client: 'pq',
  connection: {
    host: 'localhost',
    database: 'nodepq'
  }
})


module.exports = knex