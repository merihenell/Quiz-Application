import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import { validasaur } from "../../deps.js";

const validationRules = {
  question: [validasaur.required, validasaur.minLength(1)],
};

// view specific question and the answer options for it by rendering question specific page
const viewQuestion = async ({ params, render }) => {
  render("question.eta", { topic: await topicService.findById(params.tId), question: await questionService.findById(params.qId), options: await answerService.findByQuestionId(params.qId) });
};

// if there are questions for the topic, redirect to view random question for the topic,
// otherwise render page with text "No questions for this topic yet!"
const randomQuestion = async ({ params, response, render }) => {
  const question = await questionService.randomByTopic(params.tId);
  
  if (question) {
    response.redirect(`/quiz/${params.tId}/questions/${question.id}`);
  } else {
    render("noQuestions.eta", { topic: await topicService.findById(params.tId) })
  }
};

// view question and answer options for quiz by rendering quiz question page
const viewQuizQuestion = async ({ params, render }) => {
  render("quizQuestion.eta", { topic: await topicService.findById(params.tId), question: await questionService.findById(params.qId), options: await answerService.findByQuestionId(params.qId) });
};

// if question is at least one character, add new question to topic based on form and redirect to topic specific page,
// otherwise render topic specific page with the validaton errors
const addQuestion = async ({ params, request, response, user, render }) => {
  const body = request.body({ type: "form" });
  const formParams = await body.value;
  const question = formParams.get("question_text");

  const data = {
    question: question, 
  };

  const [passes, errors] = await validasaur.validate(
    data,
    validationRules,
  );

  if (!passes) {
    data.topic = await topicService.findById(params.id);
    data.questions = await questionService.findByTopicId(params.id);
    data.validationErrors = errors;
    render("topic.eta", data);
  } else {
    await questionService.add(user.id, params.id, question);
    response.redirect(`/topics/${params.id}`);
  }
};

// delete question and redirect to topic specific page
const deleteQuestion = async ({ params, response }) => {
  await questionService.del(params.qId);
  response.redirect(`/topics/${params.tId}`);
};

export { randomQuestion, viewQuestion, viewQuizQuestion, addQuestion, deleteQuestion };