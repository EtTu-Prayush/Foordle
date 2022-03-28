const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function check_login_data(data) {
  let flag = false;
  if (isEmpty(data.email)) {
    data.email = "";
  }
  if (isEmpty(data.password)) {
    data.password = "";
  }
  let errors = {};

  if (validator.isEmpty(data.email)) {
    flag = true;
    errors.email = "Email Field Empty";
  } else if (validator.isEmail(data.email) == false) {
    flag = true;
    errors.email = "Enter a valid Email address";
  }
  if (validator.isEmpty(data.password)) {
    flag = true;
    errors.password = "Password Field Empty";
  }

  return { errors, valid_bit: !flag };
};
