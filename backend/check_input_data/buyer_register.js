const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function check_buyer_register_data(data) {
  // replace the empty with null strings for the validator to be able to work
  // required field
  let flag = false;
  if (isEmpty(data.name)) {
    data.name = "";
  }
  // required
  if (isEmpty(data.email)) {
    data.email = "";
  }
  // required
  if (isEmpty(data.contact_number)) {
    data.contact_number = "";
  }
  // required
  if (isEmpty(data.batch_name)) {
    data.batch_name = "";
  }
  // required
  if (isEmpty(data.password)) {
    data.password = "";
  }
  
  // required
  if (isEmpty(data.age)) {
    data.age = "";
  }

  // Create a variable to store errors
  let errors = {};

  if (validator.isEmpty(data.name)) {
    flag = true;
    errors.name = "Name Field Empty";
  }

  if (validator.isEmpty(data.email)) {
    flag = true;
    errors.email = "Email Field Empty";
  } else if (validator.isEmail(data.email) == false) {
    flag = true;
    errors.email = "Enter a valid Email address";
  }

  if (validator.isEmpty(data.batch_name)) {
    flag = true;
    errors.batch_name = "Batch-Name Field Empty";
  }
  if (validator.isEmpty(data.contact_number)) {
    flag = true;
    errors.contact_number = "Contact-Number Field Empty";
  }
  if (validator.isEmpty(data.age)) {
    flag = true;
    errors.age = "Age Field Empty";
  }
  if (validator.isEmpty(data.password)) {
    flag = true;
    errors.password = "Password Field Empty";
  }
  
  return { errors, valid_bit: !flag };
};
