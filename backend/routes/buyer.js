var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const check_buyer_register_data = require("./../check_input_data/buyer_register");
const buyer = require("../models/buyer");
const vendor = require("../models/vendor");

router.post("/register", (req, res) => {
  // Get the whole data as req.body
  // let error = {};
  const { error, valid_bit } = check_buyer_register_data(req.body);
  if (valid_bit) {
    // atleast the data entered is valid as the valid bit is set

    vendor.findOne({ email: req.body.email }).then((vendor_found) => {
      if (vendor_found) {
        error_json = { email: "A buyer cannot be a vendor " };
        return res.status(400).json(error_json);
      }
    });
    buyer.findOne({ email: req.body.email }).then((buyer_found) => {
      if (buyer_found) {
        error_json = { email: "Email already exists" };
        return res.status(400).json(error_json);
      } else {
        const newBuyer = new buyer({
          name: req.body.name,
          email: req.body.email,
          contact_number: req.body.contact_number,
          batch_name: req.body.batch_name,
          age: req.body.age,
          password: req.body.password,
        });

        // store the hashed password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newBuyer.password, salt, (err, hash) => {
            if (err) throw err;
            newBuyer.password = hash;
            newBuyer
              .save()
              .then((newBuyer) => res.json(newBuyer))
              .catch((err) => res.send(err));
          });
        });
      }
    });
  } else {
    res.status(400).json(error);
  }
});

router.post("/profile", (req, res) => {
  const email = req.body.email;
  buyer
    .findOne({ email: email })
    .then((buyer_found) => {
      res.json(buyer_found);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.put("/edit_profile", (req, res) => {
  const email = req.body.email;
  buyer
    .findOne({ email: email })
    .then((buyer_found) => {
      buyer_found.name = req.body.name;
      buyer_found.email = req.body.email;
      buyer_found.contact_number = req.body.contact_number;
      buyer_found.batch_name = req.body.batch_name;
      buyer_found.age = req.body.age;
      buyer_found.password = req.body.password;

      buyer_found
        .save()
        .then((buyer_found) => res.json(buyer_found))
        .catch((err) => res.send(err));
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.post("/wallet_balance", (req, res) => {
  const email = req.body.email;
  buyer
    .findOne({ email: email })
    .then((buyer_found) => {
      res.json(buyer_found.wallet);
    })
    .catch((err) => {
      res.status(404).send(err);
      us;
    });
});

router.put("/add_wallet_balance", (req, res) => {
  const email = req.body.email;
  const wallet = req.body.wallet_balance;
  buyer
    .findOne({ email: email })
    .then((buyer_found) => {
      if (Number(wallet) < 0) {
        res.status(400).send({ error: "Wallet balance cannot be negative" });
      } else {
        buyer_found.wallet = Number(buyer_found.wallet) + Number(wallet);
        buyer_found
          .save()
          .then((buyer_found) => res.json(buyer_found))
          .catch((err) => res.send(err));
      }
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.put("/sub_wallet_balance", (req, res) => {
  const email = req.body.email;
  const wallet = req.body.wallet;
  buyer
    .findOne({ email: email })
    .then((buyer_found) => {
      if (Number(wallet) < 0) {
        res.status(400).send({ error: "Amount to be deducted can't be negative" });
      } else {
        buyer_found.wallet = Number(buyer_found.wallet) - Number(wallet);
        buyer_found
          .save()
          .then((buyer_found) => res.json(buyer_found))
          .catch((err) => res.send(err));
      }
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

module.exports = router;
