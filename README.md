# node_psql


install http://postgresguide.com/setup/install.html  
#psql  

npm i --save-dev nodemon knex pg dotenv body-parser
mpm i knex -g  

knex init is gonna create a file called knexfile.js  

role nodepq  
password nodepq  
  CREATE ROLE nodepq WITH LOGIN PASSWORD 'nodepq';
database nodepq  
  ALTER ROLE me CREATEDB; // it allows the role nodepq creates a db  
  CREATE DATABASE nodepq;  
table user  
  \c nodepq  
  CREATE TABLE users (  
  ID SERIAL PRIMARY KEY,  
  name VARCHAR(30),  
  email VARCHAR(30),  
  userActive BOOL,
  userAdmin BOOL
);  

INSERT INTO users (name, email, userAdmin)  
VALUES ('bob', 'bob@email.com', TRUE), ('sue','sue@email.com', FALSE);  


