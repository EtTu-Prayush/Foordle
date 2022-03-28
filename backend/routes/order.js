var express = require("express");
var router = express.Router();
const order = require("../models/order");
const vendor = require("../models/vendor");
const food = require("../models/food");
// get the order data 
// no need to edit 
/// do we delete the order data from the database ? 
// for now assuming no deletion , only write API endpoints for 
// adding the order data
// and fetching the order data 

router.post("/place_order", (req, res) => {

    // make the new order 
    const newOrder = new order({
        item_name: req.body.item_name,
        vendor_shop: req.body.vendor_shop,
        vendor_email: req.body.vendor_email,
        buyer_email: req.body.buyer_email,
        quantity: req.body.quantity,
        placed_time: req.body.placed_time,
        addon_name: req.body.addon_name,
        addon_price: req.body.addon_price,
        bill: req.body.bill
    });

    // update the add-on bill value 
    newOrder
        .save()
        .then(order => res.json(order))
        .catch(err => console.log(err));

});

router.post("/getbuyerorder", (req, res) => {
    order.find({ buyer_mail: req.body.buyer_mail })
        .then(order => res.json(order))
        .catch(err => console.log(err));
});

router.post("/myorder", (req, res) => {
    order.find({ buyer_email: req.body.buyer_email })
        .then(order => res.status(200).json(order))
        .catch(err => res.status(400).json(err));
})

router.post("/getorder", (req, res) => {
    order.find({ vendor_email: req.body.vendor_email })
        .then(order => res.json(order))
        .catch(err => console.log(err));
})

router.put("/changestate", (req, res) => {
    const id = req.body._id;
    const state = req.body.state
    order.findOne({ _id: id })
        .then((order_found) => {
            order_found.status = state;
            order_found
                .save()
                .then((order_found) => res.json(order_found))
                .catch((err) => res.send(err));
        })
        .catch((err) => {
            res.status(404).send(err);
        });
});

router.post("/getstatecount", (req, res) => {
    let cooking = 0
    let accept = 0
    let i = 0
    order.find({ vendor_email: req.body.vendor_email })

        .then((order_found) => {
            order_found.forEach(order => {
                if (order.status === "COOKING")
                    cooking++;
                else if (order.status === "ACCEPTED")
                    accept++
            })
            res.json({ cooking: cooking, accept: accept });

        })
        .catch((err) => {
            res.status(404).send(err);
        });
});

router.put("/handlestatechange", (req, res) => {
    const id = req.body._id;
    const state = req.body.status
    let order_data = {}

    order.findOne({ _id: id })
        .then((order_found) => {
            order_found.status = state;
            order_found
                .save()
                .then((order_found) => order_data = order_found)
                .catch((err) => order_data = "");
        })
        .catch((err) => {
            order_data = "";
        });

    let cooking = 0, accept = 0
    order.find({ vendor_email: req.body.email, status: "COOKING" })
        .then((order_found) => {
            if (order_found) {
                cooking = order_found.length
            }
        });
    order.find({ vendor_email: req.body.email, status: "ACCEPTED" })
        .then((order_found) => {
            if (order_found) {
                accept = order_found.length
            }
        })

    res.json({ accept: accept, cooking: cooking, order_data: order_data });
});

router.put("/rate", (req, res) => {
    const id = req.body._id;
    const rate = req.body.rate
    order.findOne({ _id: id })
        .then((order_found) => {
            order_found.rated = rate;
            console.log("MY ORDER" + order_found);
            order_found
                .save()
                .then((order_found) => res.json(order_found))
                .catch((err) => res.send(err));
        })
        .catch((err) => {
            res.status(404).send(err);
        });
})


router.post("/orderstat", (req, res) => {
    food.find({ vendor_email: req.body.vendor_email }).sort({ num_sold: -1 }).limit(5)
        .then(food => res.json(food))
        .catch(err => console.log(err));
})

router.post("")
module.exports = router;
