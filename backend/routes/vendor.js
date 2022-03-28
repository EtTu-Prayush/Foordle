var express = require("express");
var router = express.Router();
const empty = require("is-empty");
const bcrypt = require("bcryptjs");
const check_vendor_register_data = require("./../check_input_data/vendor_register");
const buyer = require("../models/buyer");
const vendor = require("../models/vendor");
const food = require("../models/food");
const order = require("../models/order");
router.post("/register", (req, res) => {
  const { error, valid_bit } = check_vendor_register_data(req.body);
  if (valid_bit == true) {
    // atleast the data entered is valid as the valid bit is set
    buyer.findOne({ email: req.body.email }).then((buyer_found) => {
      if (buyer_found) {
        return res.status(400).json({ email: "A vendor cannot be a buyer " });
      }
    });

    vendor.findOne({ email: req.body.email }).then((vendor_found) => {
      if (vendor_found) {
        return res.status(400).json({ email: "Email already exists" });
      } else {

        vendor.findOne({ shop_name: req.body.shop_name }).then((vx) => {
          if (vx) {
            return res.status(400).json({ shop_name: "Shop name already exists" });
          }
          const newVendor = new vendor({
            manager_name: req.body.manager_name,
            email: req.body.email,
            shop_name: req.body.shop_name,
            contact_number: req.body.contact_number,
            open_time: req.body.open_time,
            password: req.body.password,
            close_time: req.body.close_time,
          });
          // store the hashed password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newVendor.password, salt, (err, hash) => {
              if (err) throw err;
              newVendor.password = hash;
              newVendor
                .save()
                .then((newVendor) => res.json(newVendor))
                .catch((err) => res.send(err));
            });
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
  vendor.findOne({ email: email }).then((vendor_found) => {
    if (vendor_found) {
      res.json(vendor_found);
    } else {
      res.status(404).send("No vendor found");
    }
  });
});

router.put("/edit_profile", (req, res) => {
  const email = req.body.email;
  vendor
    .findOne({ email: email })
    .then((buyer_found) => {
      buyer_found.manager_name = req.body.manager_name;
      buyer_found.email = req.body.email;
      buyer_found.contact_number = req.body.contact_number;
      buyer_found.open_time = req.body.open_time;
      buyer_found.close_time = req.body.close_time;
      buyer_found.shop_name = req.body.shop_name;
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

router.post("/food_items", (req, res) => {
  const item_name = req.body.name;
  const vendor_name = req.body.vendor_email;
  food.findOne({ name: item_name, vendor_email: vendor_name }).then((food_found) => {
    if (food_found) {
      res.status(400).send("Item already exists");
    } else {
      addon_names = []
      if (req.body.addon_name.length != req.body.addon_price.length) {
        for (let i = 0; i < req.body.addon_price.length; i++)
          addon_names.push(req.body.addon_name[i])
      }
      const newFood = new food({
        name: req.body.name,
        price: req.body.price,
        vendor_shop: req.body.vendor,
        vendor_email: req.body.vendor_email,
        addon_name: addon_names,
        food_type: req.body.food_type,
        addon_price: req.body.addon_price,
        tags: req.body.tags
      });
      newFood
        .save()
        .then((newFood) => res.status(200).json(newFood))
        .catch((err) => res.status(410).send(err));
    }
  });
});

router.put("/food_items", (req, res) => {
  const id = req.body.id;
  food.findOne({ _id: id }).then((food_found) => {
    if (food_found) {
      food_found.name = req.body.name;
      food_found.price = req.body.price;
      food_found.vendor = req.body.vendor;
      food_found.rating = (req.body.rating) ? req.body.rating : 0;
      food_found.food_type = req.body.food_type;
      food_found.addon_name = req.body.addon_name;
      food_found.tags = req.body.tags;
      food_found.addon_price = req.body.addon_price;
      // food_found.image = req.body.image;
      food_found
        .save()
        .then((food_found) => res.status(200).json(food_found))
        .catch((err) => res.status(400).send(err));
    } else {
      res.status(404).send("No food item found");
    }
  });
});

router.post("/item_list", (req, res) => {
  const vendor_name = req.body.email;
  food.find({ vendor_email: vendor_name }).then((food_found) => {
    if (food_found) {
      res.json(food_found);
    } else {
      res.status(404).send("No items found");
    }
  });
});

router.post("/getitem", (req, res) => {
  const item_name = req.body.name;
  const vendor_name = req.body.vendor_email;
  food.find({ name: item_name, vendor_email: vendor_name }).then((food_found) => {
    if (food_found) {
      res.status(200).json(food_found);
    } else {
      res.status(404).send("No items found");
    }
  });
});

router.post("/add_tag", (req, res) => {
  const vendor_name = req.body.vendor;
  const item_name = req.body.name;
  food.findOne({ name: item_name, vendor: vendor_name }).then((food_found) => {
    if (food_found) {
      food_found.tags.push(req.body.tag);
      food_found
        .save()
        .then((food_found) => res.json(food_found))
        .catch((err) => res.send(err));
    } else {
      res.status(404).send("No item found");
    }
  });
});

router.post("/remove_tag", (req, res) => {
  const vendor_name = req.body.vendor;
  const item_name = req.body.name;
  food.findOne({ name: item_name, vendor: vendor_name }).then((food_found) => {
    if (food_found) {
      food_found.tags.pop(req.body.tag);
      food_found
        .save()
        .then((food_found) => res.json(food_found))
        .catch((err) => res.send(err));
    } else {
      res.status(404).send("No item found");
    }
  });
});

router.post("/remove_item", (req, res) => {
  const item_name = req.body.name;
  const vendor_name = req.body.vendor_email;
  food.deleteOne({ name: item_name, vendor_email: vendor_name })
    .then((food_found) => {
      res.status(200).json({ status: "Success", food_found: food_found });
    }
    )
    .catch((err) => res.send(err));
});

router.put("/changecount", (req, res) => {
  const email = req.body.email;
  const item_name = req.body.item_name;
  const value = req.body.value;
  vendor.findOne({ email: email })
    .then((vendor_found) => {
      vendor_found[item_name] += Number(value);
      vendor_found
        .save()
        .then((vendor_found) => res.json(vendor_found))
        .catch((err) => res.send(err));
    })
    .catch((err) => res.send(err));
});

router.put("/addOrder", (req, res) => {

  const email = req.body.email;
  const item_name = req.body.item_name;
  food.findOne({ name: item_name, vendor_email: email })
    .then((food_found) => {
      food_found.count += 1;
      food_found
        .save()
        .then((food_found) => res.json(food_found))
        .catch((err) => res.send(err));
    })
    .catch((err) => res.send(err));
});

router.put("/orderAageKro", (req, res) => {
  const id = req.body.id;
  const vendor_email = req.body.email;
  const item_name = req.body.item;
  response = {}
  food.findOne({ name: item_name, vendor_email: vendor_email })
    .then((food_found) => {
      if (food_found) {
        food_found.num_ordered += 1;
        food_found
          .save()
          .then((food_found) => response.food_item = food_found)
          .catch((err) => response.food = err);
      } else {
        response.food = "No food item found";
      }
    }
    )
    .catch((err) => response.food = err);

  vendor.findOne({ email: req.body.email })
    .then((vendor_found) => {
      vendor_found.order_placed += req.body.placed;
      vendor_found.pending_order += req.body.pending;
      vendor_found.completed_order += req.body.complete;
      vendor_found
        .save()
        .then((vendor_found) => response.vendor = vendor_found)
        .catch((err) => response.vendor = err);
    })
    .catch((err) => response.vendor = err);

  order.find({ _id: id })
    .then((order_found) => {
      if (order_found) {
        order_found.status = req.body.status;
        order_found
          .save()
          .then((order_found) => response.order = order_found)
          .catch((err) => response.order = err);
      } else {
        response.order = "No order found";
      }
    })
    .catch(err => response.order = err);
});

router.put("/updateCount", (req, res) => {
  const email = req.body.vendor_email;
  const pending = req.body.pending
  vendor
    .findOne({ email: email })
    .then((order_found) => {
      console.log("HERE" + order_found.status + " " + pending)
      order_found.pending_order += Number(pending);
      order_found
        .save()
        .then((order_found) => res.json(order_found))
        .catch((err) => res.send(err));
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.put("/updatePlace", (req, res) => {
  const email = req.body.vendor_email;

  vendor.findOne({ email: email })
    .then((order_found) => {
      order_found.order_placed += 1;
    })

    .catch((err) => {
      res.status(404).send(err);
    });
});

router.put("/updateComplete", (req, res) => {
  const email = req.body.vendor_email;
  vendor
    .findOne({ email: email })
    .then((order_found) => {
      order_found.completed_order += 1;
      order_found
        .save()
        .then((order_found) => res.json(order_found))
        .catch((err) => res.send(err));
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

router.post("/getSTATS", (req, res) => {

  let completed = 0
  let total = 0
  let cancelled = 0
  order.find({ vendor_email: req.body.email })
    .then((order_found) => {
      order_found.forEach(element => {
        if (element.status === "COMPLETED")
          completed += 1
        if (element.status === "REJECTED")
          cancelled += 1;
        total++
      });
      res.json({ completed: completed, total: total, cancelled: cancelled })
    })
    .catch((err) => {
      res.status(404).send(err);
    });

})
module.exports = router;
