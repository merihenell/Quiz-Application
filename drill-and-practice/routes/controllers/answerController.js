import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import { validasaur } from "../../deps.js";

const validationRules = {
  option: [validasaur.required, validasaur.minLength(1)],
};

// add user answer to database and redirect to correct answer or incorrect answer page depending on the answer
const answerQuestion = async ({ user, params, response }) => {
  const option = await answerService.findById(params.oId);
  await answerService.addAnswer(user.id, params.qId, params.oId);
  if (option.is_correct) {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
  } else {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
  }
};

// render correct answer page
const correctAnswer = async ({ params, render }) => {
  render("correctAnswer.eta", { topic: await topicService.findById(params.tId)});
};

// render incorrect answer page
const incorrectAnswer = async ({ params, render }) => {
  render("incorrectAnswer.eta", { topic: await topicService.findById(params.tId), options: await answerService.findByQuestionId(params.qId) });
};

// if answer option is at least one character, add new answer option to question and redirect to question specific page,
// otherwise render question specific page with the validation errors
const addOption = async ({ params, request, response, render }) => {
  const body = request.body({ type: "form" });
  const formParams = await body.value;
  const option = formParams.get("option_text");
  let correct = false;
  
  if (formParams.has("is_correct")) {
    correct = true;
  }

  const data = {
    option: option,
    correct: correct,
  };

  const [passes, errors] = await validasaur.validate(
    data,
    validationRules,
  );

  if (!passes) {
    data.topic = await topicService.findById(params.tId);
    data.question = await questionService.findById(params.qId);
    data.options = await answerService.findByQuestionId(params.qId);
    data.validationErrors = errors;
    render("question.eta", data);
  } else {
    await answerService.addOption(params.qId, option, correct);
    response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
  }
};

// delete answer option and redirect to question specific page
const deleteOption = async ({ params, response }) => {
  await answerService.delOption(params.oId);
  response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

export { answerQuestion, correctAnswer, incorrectAnswer, addOption, deleteOption };