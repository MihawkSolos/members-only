const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS users, posts;

CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    member BOOLEAN DEFAULT FALSE
    );

CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    text TEXT NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
    );
`

async function main() {
    console.log("seeding...");
    const client = new Client({
      connectionString: "postgresql://chaos:Uchiha0603@localhost:5432/auth_app_db", //change
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
  }
  
  main();