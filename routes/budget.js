const router = require("express").Router();
const asyncMiddleWare = require("../middleware/async");
const auth = require("../middleware/auth");
const Account = require("../models/Account");


//this route gets the budget in the databse
router.get("/getBudget", auth, asyncMiddleWare(async (req, res) => {
    const user = req.user._id;
    const budget = await Account.findOne({ userId: user });
    res.send(budget.budget);
}))


//this route save the budget in the database
router.post("/saveBudget", auth, asyncMiddleWare(async (req, res) => {
    const user = req.user._id
    const data = req.body.data;

    //save the data in data
    const dataSaved = await Account.updateMany({ userId: user }, {
        $set: {
            "budget.payment": data.payment,
            "budget.travel": data.travel,
            "budget.transfer": data.transfer,
            "budget.food": data.food,
            "budget.recreation": data.recreational
        }
    });

    //send the data back to the user
    dataSaved.save();
    console.log(dataSaved);
}))

module.exports = router;