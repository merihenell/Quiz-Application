import { sql } from "../database/database.js";

// return all topics in alphabetical order
const findAll = async () => {
  const rows = await sql`SELECT * FROM topics ORDER BY name`;
  return rows;
};

// return topic with given id
const findById = async (id) => {
  const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;
  return rows[0];
};

// add topic
const add = async (userId, name) => {
  await sql`INSERT INTO topics (user_id, name) VALUES (${userId}, ${name})`;
};

// delete topic with given id and all questions, answer options, and answers related to that topic
const del = async (id) => {
  const rows = await sql`SELECT * FROM questions WHERE topic_id = ${id}`;
  for (let i = 0; i < rows.length; i++) {
    await sql`DELETE FROM question_answers WHERE question_id = ${rows[i].id}`;
    await sql`DELETE FROM question_answer_options WHERE question_id = ${rows[i].id}`;
  }
  await sql`DELETE FROM questions WHERE topic_id = ${id}`;
  await sql`DELETE FROM topics WHERE id = ${id}`;
};

// return total number of topics
const count = async () => {
  const rows = await sql`SELECT COUNT(*) AS count FROM topics`;
  return rows[0];
};

export { findAll, findById, add, del, count };