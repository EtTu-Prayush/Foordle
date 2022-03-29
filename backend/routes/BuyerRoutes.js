var express = require("express");
var router = express.Router();
// Load User model
const User = require("../models/Users");
const Vendor = require("../models/Vendors");
const Buyer = require("../models/Buyers");
const Order = require("../models/Orders");
const FoodItem = require("../models/FoodList");

//Menu
router.post("/showmenu", (req, res) => {
  //Show all items
  FoodItem.find({})
    .then((items) => {
      items.sort((a, b) => {
        if(a.itemname < b.itemname) {
          return -1;
        }
        if(a.itemname > b.itemname) {
          return 1;
        }
        return 0;
      });
      items.sort((a, b) => {
        if(a.shopname < b.shopname) {
          return -1;
        }
        if(a.shopname > b.shopname) {
          return 1;
        }
        return 0;
      });
      res.status(200).json(items);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/getitem", (req, res) => {
  const _id = req.body._id;
  FoodItem.findOne({ _id: _id })
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//favourites
router.post("/addfavourite", (req, res) => {
  const _id = req.body._id;
  const email = req.body.email;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      //dont push if already present
      if (buyer.favourites.indexOf(_id) == -1) {
        buyer.favourites.push(_id);
        buyer
          .save()
          .then((buyer) => {
            res.status(200).json(buyer);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(400).json({ error: "Item already added to favourites" });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//remove favourites
router.post("/removefavourite", (req, res) => {
  const _id = req.body._id;
  const email = req.body.email;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      buyer.favourites.pull(_id);
      buyer
        .save()
        .then((buyer) => {
          res.status(200).json(buyer);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//get all favourites
router.post("/getfavourites", (req, res) => {
  const email = req.body.email;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      //get ids of favourites, then get all items with those ids
      const favourites = buyer.favourites;
      FoodItem.find({ _id: { $in: favourites } })
        .then((items) => {
          res.status(200).json(items);
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//get shopname, opening and closing time
router.post("/shoptimings", (req, res) => {
  Vendor.find({})
    .then((vendors) => {
      // store all shopnames, opentime, closetime in array, object { shopname, opentime, closetime }
      const shoptimings = [];
      for (let i = 0; i < vendors.length; i++) {
        shoptimings.push({
          email: vendors[i].email,
          shopname: vendors[i].shopname,
          opentime: vendors[i].opentime,
          closetime: vendors[i].closetime,
        });
      }
      res.status(200).json(shoptimings);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Return wallet details
router.post("/walletdetails", (req, res) => {
  const email = req.body.email;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      if (!buyer) {
        res.status(400).json({ error: "User does not exist" });
      } else {
        res.status(200).json({
          wallet: buyer.wallet,
        });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Add money to wallet
router.post("/addmoney", (req, res) => {
  const email = req.body.email;
  const amount = req.body.amount;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      if (!buyer) {
        res.status(400).json({ error: "User does not exist" });
      } else {
        buyer.wallet = buyer.wallet + parseInt(amount);
        buyer
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
});

//Order an item
router.post("/orderitem", (req, res) => {
  const order = new Order({
    item_id: req.body.item_id,
    itemname: req.body.itemname,
    vendoremail: req.body.vendoremail,
    shopname: req.body.shopname,
    buyeremail: req.body.buyeremail,
    buyername: req.body.buyername,
    placedtime: req.body.placedtime,
    quantity: req.body.quantity,
    addonname: req.body.addonname,
    addonprice: req.body.addonprice,
    totalprice: req.body.totalprice,
  });
  order
    .save()
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//deduct money
router.post("/deductmoney", (req, res) => {
  const email = req.body.email;
  const amount = req.body.amount;
  Buyer.findOne({ email: email })
    .then((buyer) => {
      if (!buyer) {
        res.status(400).json({ error: "User does not exist" });
      } else {
        buyer.wallet = buyer.wallet - parseInt(amount);
        buyer
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
});

//increased placed count for fppd item
// router.post("/increaseplacedcount", (req, res) => {
//     const _id = req.body._id;

//     FoodItem.findOne({ _id: _id })
//         .then((item) => {
//             item.placedcount = item.placedcount + 1;

//my orders
router.post("/pickuporder", (req, res) => {
  const _id = req.body._id;
  Order.findOne({ _id: _id })
    .then((order) => {
      if (!order) {
        res.status(400).json({ error: "Order does not exist" });
      } else {
          //Increase count of sold in FoodItem
            FoodItem.findOne({ _id: order.item_id })
            .then((item) => {
                item.sold = item.sold + order.quantity;
                item.save();
            })
            .catch((err) => {
                res.status(400).send(err);
            });
            
        if (order.status === "READY FOR PICKUP") {
          order.status = "COMPLETED";
        }
        order
          .save()
          .then((order) => {
            res.status(200).json(order);
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

//get all orders
router.post("/getallorders", (req, res) => {
  const buyeremail = req.body.buyeremail;
  Order.find({ buyeremail: buyeremail })
    .then((orders) => {
      //sort order from last
      orders.sort((a, b) => {
        return new Date(b.placedtime) - new Date(a.placedtime);
      });
      res.status(200).json(orders);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//ratethefood
router.post("/ratethefood", (req, res) => {
  const _id = req.body._id;
  const rating = req.body.rating;

  Order.findOne({ _id: _id })
    .then((food) => {
      if (!food) {
        res.status(400).json({ error: "Food does not exist" });
      } else {
        food.rating = parseInt(rating);
        FoodItem.findOne({ _id: food.item_id })
          .then((item) => {
            if (!item) {
              res.status(400).json({ error: "Food does not exist" });
            } else {
              item.rating = item.rating + parseInt(rating);
              item.ratingcount = item.ratingcount + 1;
              item
                .save()
                .then((item) => {})
                .catch((err) => {
                  res.status(400).send(err);
                });
            }
          })
          .catch((err) => {
            res.status(400).send(err);
          });

        food
          .save()
          .then((food) => {
            res.status(200).json(food);
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

module.exports = router;
