import { sql } from "../database/database.js";

// add user
const addUser = async (email, password) => {
  await sql`INSERT INTO users (email, password) VALUES (${email}, ${password})`;
};

// return user with given email
const findUserByEmail = async (email) => {
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  return rows;
};  

export { addUser, findUserByEmail };