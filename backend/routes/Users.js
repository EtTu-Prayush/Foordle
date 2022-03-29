var express = require("express");
var router = express.Router();
// Load User model
const User = require("../models/Users");
const Vendor = require("../models/Vendors");
const Buyer = require("../models/Buyers");
const { route } = require("express/lib/application");

// GET request
// Getting all the users
router.get("/", function (req, res) {
  User.find(function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request Register
router.post("/register", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    date: req.body.date,
  });

  newUser
    .save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//POST request Register Buyer
router.post("/registerbuyer", (req, res) => {
  const newBuyer = new Buyer({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    contact: req.body.contact,
    age: req.body.age,
    batch: req.body.batch,
    wallet: 0,
  });

  const email = req.body.email;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      if (buyer) {
        res.status(400).json({ error: "User already exists" });
      } else {
        Vendor.findOne({ email: email })
          .then((vendor) => {
            if (vendor) {
              res.status(400).json({ error: "User already exists" });
            } else {
              newBuyer
                .save()
                .then((buyer) => {
                  res.status(200).json(buyer);
                })
                .catch((err) => {
                  res.status(400).send(err);
                });
            }
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//POST request Register Vendor
router.post("/registervendor", (req, res) => {
  const newVendor = new Vendor({
    managername: req.body.managername,
    shopname: req.body.shopname,
    email: req.body.email,
    password: req.body.password,
    contact: req.body.contact,
    opentime: req.body.opentime,
    closetime: req.body.closetime,
  });

  const email = req.body.email;
  Vendor.findOne({ email: email })
    .then((vendor) => {
      if (vendor) {
        res.status(400).json({ error: "User already exists" });
      } else {
        //Also check for shopname
        Vendor.findOne({ shopname: req.body.shopname })
          .then((vendor) => {
            if (vendor) {
              res.status(400).json({ error: "Shopname already exists" });
            } else {
              Buyer.findOne({ email: email })
                .then((buyer) => {
                  if (buyer) {
                    res.status(400).json({ error: "User already exists" });
                  } else {
                    newVendor
                      .save()
                      .then((vendor) => {
                        res.status(200).json(vendor);
                      })
                      .catch((err) => {
                        res.status(400).send(err);
                      });
                  }
                })
                .catch((err) => {
                  res.status(400).send(err);
                });
            }
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// POST request Login
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  // User.findOne({ email }).then((user) => {
  //   // Check if user email exists
  //   if (!user) {
  //     return res.status(404).json({
  //       error: "Email not found",
  //     });
  //   }
  //   else {
  //       if (user.password === password) {
  //           res.send("Password Matched");
  //           return user;
  //       }
  //       else
  //       {
  //           res.send("Password Not Matched");
  //       }
  //   }
  // });
  Buyer.findOne({ email: email })
    .then((buyer) => {
      if (!buyer) {
        Vendor.findOne({ email: email })
          .then((vendor) => {
            if (!vendor) {
              res.status(404).json({
                error: "Email not found",
              });
            } else {
              if (vendor.password === password) {
                //res.send("Password Matched");
                res.json({
                  user: vendor,
                  usertype: 2,
                });
                return vendor;
              } else {
                res.status(401).json({
                  error: "Password incorrect",
                });
              }
            }
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        if (buyer.password === password) {
          //res.send("Password Matched");
          res.json({
            user: buyer,
            usertype: 1,
          });
          return buyer;
        } else {
          res.status(401).json({
            error: "Password incorrect",
          });
        }
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/buyerdetails", (req, res) => {
  const email = req.body.email;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      if (!buyer) {
        res.status(404).json({
          error: "Email not found",
        });
      } else {
        res.json(buyer);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/vendordetails", (req, res) => {
  const email = req.body.email;
  Vendor.findOne({ email: email })
    .then((vendor) => {
      if (!vendor) {
        res.status(404).json({
          error: "Email not found",
        });
      } else {
        res.json(vendor);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/buyerupdate", (req, res) => {
  const email = req.body.email;

  Buyer.updateOne(
    { email: email },
    {
      name: req.body.name,
      contact: req.body.contact,
      age: req.body.age,
      batch: req.body.batch,
    }
  )
    .then((buyer) => {
      if (!buyer) {
        res.status(404).json({
          error: "Email not found",
        });
      } else {
        res.json(buyer);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/vendorupdate", (req, res) => {
  const email = req.body.email;
  //update vendor
  Vendor.updateOne(
    { email: email },
    {
      managername: req.body.managername,
      shopname: req.body.shopname,
      contact: req.body.contact,
      opentime: req.body.opentime,
      closetime: req.body.closetime,
    }
  )
    .then((vendor) => {
      if (!vendor) {
        res.status(404).json({ error: "Email not found" });
      } else {
        res.json(vendor);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
// Vendor.findOne({ email: email })
//   .then((vendor) => {
//     if (!vendor) {
//       res.status(404).json({ error: "Email not found" });
//     } else {
//       vendor.managername = req.body.managername;
//       vendor.shopname = req.body.shopname;
//       vendor.contact = req.body.contact;
//       vendor.opentime = req.body.opentime;
//       vendor.closetime = req.body.closetime;
//       vendor.email = vendor.email;
//       vendor.password = vendor.password;
//       vendor.save()
//         .then((vendor) => {
//           res.json(vendor);
//         })
//         .catch((err) => {
//           res.status(400).send(err);
//         });
//     }
//   })
//   .catch((err) => {
//     res.status(400).send(err);
//   });

module.exports = router;
