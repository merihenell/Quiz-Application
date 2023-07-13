import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

// if email and password are correct, add user to the session and redirect to topics page,
// otherwise render login page with the errors
const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userFromDatabase = await userService.findUserByEmail(params.get("email"));

  if (userFromDatabase.length != 1) {
    render("login.eta", { error: "wrong email" });
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password,
  );

  if (!passwordMatches) {
    render("login.eta", { error: "wrong password" });
    return;
  }

  await state.session.set("user", user);
  response.redirect("/topics");
};

// render login page
const viewLoginForm = ({ render }) => {
  render("login.eta");
};

export { processLogin, viewLoginForm };