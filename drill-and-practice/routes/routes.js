import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerController from "./controllers/answerController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";

import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.viewMain);

router.get("/topics", topicController.viewTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);

router.get("/topics/:id", topicController.viewTopic);
router.post("/topics/:id/questions", questionController.addQuestion);
router.post("/topics/:tId/questions/:qId/delete", questionController.deleteQuestion);

router.get("/topics/:tId/questions/:qId", questionController.viewQuestion);
router.post("/topics/:tId/questions/:qId/options", answerController.addOption);
router.post("/topics/:tId/questions/:qId/options/:oId/delete", answerController.deleteOption);

router.get("/quiz", topicController.viewQuizTopics);
router.get("/quiz/:tId", questionController.randomQuestion);
router.get("/quiz/:tId/questions/:qId", questionController.viewQuizQuestion);
router.post("/quiz/:tId/questions/:qId/options/:oId", answerController.answerQuestion);
router.get("/quiz/:tId/questions/:qId/correct", answerController.correctAnswer);
router.get("/quiz/:tId/questions/:qId/incorrect", answerController.incorrectAnswer);

router.get("/auth/register", registrationController.viewRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.viewLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/api/questions/random", questionApi.randomQuestion);
router.post("/api/questions/answer", questionApi.answerQuestion);

export { router };