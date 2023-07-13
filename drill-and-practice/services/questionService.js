import { sql } from "../database/database.js";

// return questions with given topic id
const findByTopicId = async (topicId) => {
  const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
  return rows;
};

// return question with given id
const findById = async (id) => {
  const rows = await sql`SELECT * FROM questions WHERE id = ${id}`;
  return rows[0];
};

// return random question
const random = async () => {
  const rows = await sql`SELECT * FROM questions ORDER BY RANDOM() LIMIT 1`;
  return rows[0];
};

// return random question from topic with given id
const randomByTopic = async (topicId) => {
  const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY RANDOM() LIMIT 1`;
  return rows[0];
};

// add question to topic
const add = async (userId, topicId, question) => {
  await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${question})`;
};

// delete question with given id
const del = async (id) => {
  await sql`DELETE FROM questions WHERE id = ${id}`;
};

// return total number of questions
const count = async () => {
  const rows = await sql`SELECT COUNT(*) AS count FROM questions`;
  return rows[0];
};

export { findByTopicId, findById, random, randomByTopic, add, del, count };