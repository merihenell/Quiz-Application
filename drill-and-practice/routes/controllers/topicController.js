import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const validationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};

// view all topics by rendering topics page
const viewTopics = async ({ render, user }) => {
  render("topics.eta", { topics: await topicService.findAll(), admin: user.admin });
};

// view specific topic and the questions for it by rendering topic specific page
const viewTopic = async ({ params, render }) => {
  render("topic.eta", { topic: await topicService.findById(params.id), questions: await questionService.findByTopicId(params.id) });
};

// view topics for quiz by rendering quiz topics page
const viewQuizTopics = async ({ render }) => {
  render("quizTopics.eta", { topics: await topicService.findAll() });
};

// only for admin
// if topic is at least one character, add new topic based on form and redirect to topics page,
// otherwise render topics page with the validaton errors
const addTopic = async ({ request, response, user, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const name = params.get("name");

  const data = {
    name: name, 
  };

  const [passes, errors] = await validasaur.validate(
    data,
    validationRules,
  );

  if (!passes) {
    data.topics = await topicService.findAll();
    data.admin = user.admin;
    data.validationErrors = errors;
    render("topics.eta", data);
  } else {
    if (user.admin) {
      await topicService.add(user.id, name);
    }
    response.redirect("/topics");
  }
};

// only for admin
// delete topic and redirect to topics page
const deleteTopic = async ({ params, response, user }) => {
  if (user.admin) {
    await topicService.del(params.id);
  }
  response.redirect("/topics");
};

export { viewTopics, viewTopic, viewQuizTopics, addTopic, deleteTopic };