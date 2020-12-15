const router = require('express').Router();
const asyncErrorHandler = require("../middleware/async");
const bcrypt = require('bcryptjs');
const { User, SignUpValidation } = require("../models/user");

router.post("/", asyncErrorHandler(async (req, res, next) => {

    //check if the body matches the schema made
    const request = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    //Checking if all of the data feilds are in correct
    const { error } = SignUpValidation(request);
    if (error) return res.status(400).send(error.details[0].message);
    //if there is someone with the same email then the api sends an error
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("This email is already Registered");
    
    //checking to see if both passwords match
    let pass = req.body.password === req.body.retypedPassword;
    if (!pass) return res.status(400).send("The passwords did not match")

    //hasing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating the shape data for the user
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })

    //save the user in database and generate token
    user = await user.save();
    const token = user.generateToken();

    //send token and data to the client
    res.header('x-auth-token', token).send(req.body.name + " is now a user");
}))
module.exports = router;