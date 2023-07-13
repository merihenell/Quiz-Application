import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

// render main page to view total number of topics, questions, and answers
const viewMain = async ({ render }) => {
  render("main.eta", { topics: await topicService.count(),
    questions: await questionService.count(),
    answers: await answerService.count() });
};

export { viewMain };