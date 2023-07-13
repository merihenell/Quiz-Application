# Quiz Application

The main page includes a short description of the application, statistics (number of topics, questions, and answers), and links to registration and login forms. There is also a navigation bar with links to topics and quiz. The topics page contains a list of topics and, if the user has been authenticated as an admin, a form to add new topics and a delete button to delete topics and related questions and answers. A topic, "Finnish language", is added by default when the application is launched. The admin email is "admin@admin.com" and password is "123456". Each topic is a link to a topic specific page with a list of questions for the topic and a form to add questions. Furthermore, each question is a link to a question specific page with a list of answer options and a form to add answer options. Answer options can be deleted by clicking the delete option button and the question can be deleted by clicking the delete question button if there are no options. The quiz page contains a list of topics with links to topic specific quizzes. Clicking a link shows a random question for the topic which can be answered.

The application uses a three-tier architecture (client, server, and database) and a layered architecture with four layers (views, controllers, services, and database).

The application can be accessed at http://localhost:7777 after running it locally with the command ```docker-compose up --build```. The tests in e2e-playwright can be run with the command ```docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf```. Remember to replace the database configurations for PostgreSQL, Flyway, and Deno's PostgreSQL driver in the template.env file with your own database credentials.