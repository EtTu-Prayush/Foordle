const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function check_vendor_register_data(data) {
  // replace the empty with null strings for the validator to be able to work
  // required field
  let flag = false;
  if (isEmpty(data.manager_name)) {
    data.manager_name = "";
  }
  // required
  if (isEmpty(data.email)) {
    data.email = "";
  }
  // required
  if (isEmpty(data.shop_name)) {
    data.shop_name = "";
  }
  // required
  if (isEmpty(data.contact_number)) {
    data.contact_number = "";
  }
  // required
  if (isEmpty(data.open_time)) {
    data.open_time = "";
  }
  // required
  if (isEmpty(data.password)) {
    data.password = "";
  }
  // required
  if (isEmpty(data.close_time)) {
    data.close_time = "";
  }
  // Create a variable to store errors
  let errors = {};
  if (validator.isEmpty(data.manager_name)) {
    flag = true;
    errors.manager_name = "Manager-Name Field Empty";
  }
  if (validator.isEmpty(data.email)) {
    flag = true;
    errors.email = "Email Field Empty";
  } else if (validator.isEmail(data.email) == false) {
    flag = true;
    errors.email = "Enter a valid Email address";
  }
  if (validator.isEmpty(data.shop_name)) {
    flag = true;
    errors.shop_name = "Shop-Name Field Empty";
  }
  if (validator.isEmpty(data.contact_number)) {
    flag = true;
    errors.contact_number = "Contact-Number Field Empty";
  }
  if (validator.isEmpty(data.open_time)) {
    flag = true;
    errors.open_time = "Open-Time Field Empty";
  }
  if (validator.isEmpty(data.close_time)) {
    flag = true;
    errors.close_time = "Close Time Field Empty";
  }
  if (validator.isEmpty(data.password)) {
    flag = true;
    errors.password = "Password Field Empty";
  }
  return { errors, valid_bit: !flag };
};
