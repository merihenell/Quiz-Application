import { bcrypt, validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const validationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

// if email is in valid form and password is at least four characters, register user and redirect to login page,
// otherwise render registration page with the validation errors
const registerUser = async ({ request, response, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const email = params.get("email");
  const password = params.get("password")

  const data = {
    email: email,
    password: password, 
  };

  const [passes, errors] = await validasaur.validate(
    data,
    validationRules,
  );

  if (!passes) {
    data.validationErrors = errors;
    render("registration.eta", data);
  } else {
    await userService.addUser(email, await bcrypt.hash(password));
    response.redirect("/auth/login");
  }
};

// render registration page
const viewRegistrationForm = ({ render }) => {
  render("registration.eta");
};

export { registerUser, viewRegistrationForm };