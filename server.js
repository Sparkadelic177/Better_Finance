const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const login = require("./routes/login");
const signup = require("./routes/signup");
const plaid = require('./routes/plaid');
const debt = require('./routes/debt')
const app = express();

// if the web token is not defind the server will not run
if(!config.get('jwtPrivateKey')){
  console.log("the private key is not defined ")
  process.exit(1);
}


// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//this allows CORS on all of the resources 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Connect to MongoDB

mongoose.connect(config.get("mongoURI"),{ useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));


//routues that are used
app.use(express.json()); 
app.use("/api/signup", signup);
app.use("/api/login" , login);
app.use("/api/plaid", plaid);
app.use("/api/debt", debt);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} ! this is the key: ${config.get("mongoURI")}`));