import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

// return random question from the database or empty JSON object if there are none
const randomQuestion = async ({ response }) => {
  const question = await questionService.random();

  if (question) {
    const options = await answerService.findByQuestionId(question.id);
    for (let i = 0; i < options.length; i++) {
      options[i].optionId = options[i].id;
      delete options[i].id;
      options[i].optionText = options[i].option_text;
      delete options[i].option_text;
      delete options[i].question_id;
      delete options[i].is_correct;
    }
    response.body = { questionId: question.id, questionText: question.question_text, answerOptions: options };
  } else {
    response.body = {}; 
  }
};

// return JSON object to see if answer was correct or not
const answerQuestion = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;
  const answer = await answerService.findById(document.optionId);
  response.body = { correct: answer.is_correct };
};

export { randomQuestion, answerQuestion };