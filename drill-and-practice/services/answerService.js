import { sql } from "../database/database.js";

// return answer options for question with given id
const findByQuestionId = async (questionId) => {
  const rows = await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
  return rows;
};

// return answer option with given id
const findById = async (id) => {
  const rows = await sql`SELECT * FROM question_answer_options WHERE id = ${id}`;
  return rows[0];
};

// add answer option to question
const addOption = async (questionId, option, correct) => {
  await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${option}, ${correct})`;
};

// add user answer to database
const addAnswer = async (userId, questionId, optionId) => {
  await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES (${userId}, ${questionId}, ${optionId})`;
};

// delete answer option with given id and all answers related to it
const delOption = async (id) => {
  await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${id}`;
  await sql`DELETE FROM question_answer_options WHERE id = ${id}`;
 };

// return total number of answers
const count = async () => {
  const rows = await sql`SELECT COUNT(*) AS count FROM question_answers`;
  return rows[0];
};

export { findByQuestionId, findById, addOption, addAnswer, delOption, count };