var express = require("express");
var router = express.Router();

const buyer = require("../models/buyer");
const vendor = require("../models/vendor");
const bcrypt = require("bcryptjs");

//const login = require("../models/login_page");

const check_login_data = require("../check_input_data/login_page");

router.post("/", (req, res) => {
  //let error = {};
  const { errors, valid_bit } = check_login_data(req.body);
  if (valid_bit) {
    const username = req.body.email;
    const password = req.body.password;

    // find the user first in the buyer ka database
    // if not found then look into the vendor ka databsae

    buyer.findOne({ email: username }).then((buyer_found) => {
      if (buyer_found) {
        bcrypt.compare(password, buyer_found.password).then((cmp) => {
          if (!cmp) {
            return res.status(400).json({ password: "Incorrect Password" });
          } else {
            // login successful
            return res.status(200).json(buyer_found);
          }
        });
      } else {
        vendor.findOne({ email: username }).then((vendor_found) => {
          if (vendor_found) {
            bcrypt.compare(password, vendor_found.password).then((cmp) => {
              if (!cmp) {
                return res.status(400).json({ password: "Incorrect Password" });
              } else {
                // login successful
                return res.status(200).json(vendor_found);
              }
            });
          } else {
            return res.status(404).json({ email: "User not found" });
          }
        });
      }
    });
  } else res.status(404).json(errors);
});

module.exports = router;
