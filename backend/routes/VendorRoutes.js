var express = require("express");
var router = express.Router();

// Load User model
const FoodItem = require("../models/FoodList");
const Order = require("../models/Orders");
const Stats = require("../models/Stats");
const Buyer = require("../models/Buyers");

router.post("/showstats", (req, res) => {
  const manageremail = req.body.manageremail;

  Stats.findOne({ manageremail: manageremail })
    .then((stats) => {
      res.status(200).json(stats);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Orders
router.post("/showorders", (req, res) => {
  const manageremail = req.body.manageremail;

  Order.find({ vendoremail: manageremail })
    .then((orders) => {
      //show the list from last
      orders.sort((a, b) => {
        if (a.placedtime < b.placedtime) {
          return 1;
        }
        if (a.placedtime > b.placedtime) {
          return -1;
        }
        return 0;
      });
      
      res.status(200).json(orders);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/updateorderstatus", (req, res) => {
  const _id = req.body._id;
  const aorr = req.body.aorr;
  //Placed, Accepted, Cooking, Reaady for pickup, Completed, Rejected

  Order.findOne({ _id: _id }).then((order) => {
    if (order.status === "PLACED") {
      if (aorr === "a") {
        order.status = "ACCEPTED";
      } else {
        order.status = "REJECTED";
      }
    } else if (order.status === "ACCEPTED") {
      order.status = "COOKING";
    } else if (order.status === "COOKING") {
      order.status = "READY FOR PICKUP";
    }
    // else if (order.status === "PICKED UP") {
    //     order.status = "COMPLETED";
    // }

    order
      .save()
      .then((order) => {
        res.status(200).json(order);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
});

router.post("/refund", (req, res) => {
  const xemail = req.body.email;
  const xamount = req.body.amount;

  Buyer.findOne({ email: xemail })
    .then((buyer) => {
      if (!buyer) {
        res.status(400).json({ error: "Buyer does not exist" });
      } else {
        buyer.wallet = buyer.wallet + parseInt(xamount);
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

//Menu
router.post("/fooditems", (req, res) => {
  const manageremail = req.body.manageremail;

  FoodItem.find({ manageremail: manageremail })
    .then((fooditems) => {
      //sort food items by shop name and return
      fooditems.sort((a, b) => {
        if (a.itemname < b.itemname) {
          return -1;
        }
        if (a.itemname > b.itemname) {
          return 1;
        }
        return 0;
      });
      res.status(200).json(fooditems);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/getshopname", (req, res) => {
  const manageremail = req.body.email;

  Vendor.findOne({ email: manageremail })
    .then((vendor) => {
      res.status(200).json({
        shopname: vendor.shopname,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/addfooditem", (req, res) => {
  const manageremail = req.body.manageremail;
  var shopname = "";

  //save new food item
  const newFoodItem = new FoodItem({
    manageremail: manageremail,
    itemname: req.body.itemname,
    price: req.body.price,
    rating: 0,
    veg: req.body.veg,
    sold: 0,
    tags: req.body.tags,
    addonname: req.body.addonname,
    addonprice: req.body.addonprice,
    shopname: req.body.shopname,
  });
  //Get shopname from Vendor collection

  //add food item to database
  FoodItem.findOne({ manageremail: manageremail, itemname: req.body.itemname })
    .then((fooditem) => {
      if (fooditem) {
        res.status(400).json({
          message: "Food item already exists",
        });
      } else {
        newFoodItem
          .save()
          .then((fooditem) => {
            res.status(200).json({
              message: "Food item added successfully",
            });
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

router.post("/editfooditem", (req, res) => {
  const _id = req.body._id;

  //edit food item
  FoodItem.findOne({ _id: _id })
    .then((fooditem) => {
      if (fooditem) {
        fooditem.itemname = req.body.itemname;
        fooditem.price = req.body.price;
        fooditem.veg = req.body.veg;
        fooditem.tags = req.body.tags;
        fooditem.addonname = req.body.addonname;
        fooditem.addonprice = req.body.addonprice;
        fooditem
          .save()
          .then((fooditem) => {
            res.status(200).json({
              message: "Food item updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(400).json({
          message: "Food item does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/deletefooditem", (req, res) => {
  const _id = req.body._id;

  FoodItem.findOne({ _id: _id })
    .then((fooditem) => {
      if (fooditem) {
        fooditem
          .remove()
          .then(() => {
            res.status(200).json({
              message: "Food item deleted successfully",
            });
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(400).json({
          message: "Food item does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//return particular food item
router.post("/fooditem", (req, res) => {
  const _id = req.body._id;

  FoodItem.findOne({ _id: _id })
    .then((fooditem) => {
      if (fooditem) {
        res.status(200).json(fooditem);
      } else {
        res.status(400).json({
          message: "Food item does not exist",
        });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//for placed orders
router.post("/statsplaced", (req, res) => {
  const manageremail = req.body.email;
  var placedorders = -1;

  //get count of orders in placed stage
  Order.find({ vendoremail: manageremail})
    .then((orders) => {
      placedorders = orders.length;
      return res.status(200).json({
        placed: placedorders,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/statscompleted", (req, res) => {
  const manageremail = req.body.email;
  var completedorders = -1;

  //get count of orders in placed stage
  Order.find({ vendoremail: manageremail, status: "COMPLETED" })
    .then((orders) => {
      completedorders = orders.length;
      return res.status(200).json({
        completed: completedorders,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/statspending", (req, res) => {
  const manageremail = req.body.email;
  var pendingorders = -1;

  //get count of orders in pending stage
  Order.find({ vendoremail: manageremail})
    .then((orders) => {
      pendingorders = 0;
      //Only accepted, cooking, ready for pickup
      for(var i=0;i<orders.length;i++){
        if( orders[i].status=="PLACED" || orders[i].status=="ACCEPTED" || orders[i].status=="COOKING" || orders[i].status=="READY FOR PICKUP"){
          pendingorders++;
        }
      }
      return res.status(200).json({
        pending: pendingorders,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});



router.post("/statstop", (req, res) => {
  const manageremail = req.body.email;
  var item = ["a", "b", "c", "d", "e"];
  var itemcount = [0, 0, 0, 0, 0];

  var storeitem = [];
  var storeitemcount = [];
  //get top 5 most sold items
  FoodItem.find({ manageremail: manageremail })
    .then((fooditem) => {
      for (var i = 0; i < fooditem.length; i++) {
        storeitem[i] = fooditem[i].itemname;
        storeitemcount[i] = fooditem[i].sold;
      }

      if (storeitem.length > 5) {
        var currentname = "";
        var currentmax = -1;
        var index = -1;
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < storeitem.length; j++) {
            if (storeitemcount[j] > currentmax) {
              currentmax = storeitemcount[j];
              currentname = storeitem[j];
              index = j;
            }
          }
          item[i] = currentname;
          itemcount[i] = currentmax;
          storeitem[index] = "";
          storeitemcount[index] = -7;
          currentmax = -1;
        }
      } else {
        var i = 0;
        for (i = 0; i < storeitem.length; i++) {
          item[i] = storeitem[i];
        }
        while (i < 5) {
          item[i] = "Nil";
          i++;
        }
      }
      return res.status(200).json({
        item: item,
        itemcount: itemcount,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//get batch details and age details of buyers of completed orders
router.post("/allemails", (req, res) => {
  const email = req.body.email;
  var emails = [];
  var ret = 0;
  var x = 1;
  Order.find({ vendoremail: email, status: "COMPLETED" })
    .then((orders) => {
        for (var i = 0; i < orders.length; i++) {
            emails[i] = orders[i].buyeremail;
        }
        return res.status(200).json({
            emails: emails,
        });
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});

//return all emails, batch details and age details of buyers
router.post("/allbuyers", (req, res) => {
    var emails = [];
    var batch = [];
    var age = [];

    Buyer.find({})
    .then((buyers) => {
        for (var i = 0; i < buyers.length; i++) {
            emails[i] = buyers[i].email;
            batch[i] = buyers[i].batch;
            age[i] = buyers[i].age;
        }
        return res.status(200).json({
            emails: emails,
            batch: batch,
            age: age,
        });
    })
    .catch((err) => {
        res.status(400).send(err);
    });
});


module.exports = router;
