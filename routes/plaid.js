const router = require("express").Router();
const moment = require('moment');
const plaid = require("plaid");
const config = require("config");
const auth = require("../middleware/auth");
const asyncMiddleWare = require("../middleware/async");
const Account = require("../models/Account");

//object used to conenct to the Plaid API
const client = new plaid.Client(
    config.get("PLAID_CLIENT_ID"),
    config.get("PLAID_SECRET"),
    config.get("PLAID_PUBLIC_KEY"),
    plaid.environments.sandbox,
    { version: "2018-05-22" }
);

let PUBLIC_TOKEN = null;
let ACCESS_TOKEN = null;
let ITEM_ID = null;

//finds out if the user has an account in the database
router.get("/account/find", auth, asyncMiddleWare(async(req, res) => {

    const userId = req.user._id; //get user id from token
    let account; 

    account = await Account.findOne({ userId: userId }) //finds the users account
    

    //if there is an account then check that it references the current user
    if (account != null) {
        console.log("This user has an account");
        if (account.userId == req.user._id) return res.send(true); //if the user has an account send true
    }

    res.send(false);
}))

//this routes checks the users balance in all accounts
router.post("/account/balance", auth, asyncMiddleWare(async(req, res) => {

    //have an object to clean the data and return to the user
    let accountData = {
        name: "",
        netWorth: {
            balance: 0,
        },
        credit: {
            balance: 0,
        },
        creditCards: [],
        loans: []
    };
     
    let accounts;
    const account = await Account.findOne({ userId: req.user._id }) //TODO: find all acoount records with this userId
   
    ACCESS_TOKEN = account.accessToken;

    client.getBalance(ACCESS_TOKEN, (err, result) => {
        // Handle err
        if (err) {
            return res.status(401).send("There was an error, try again");
        }

        //get the data from the server API
        accounts = result.accounts;

        accounts.map((results) => {
            getNetworth(results, accountData);
            getCreditAndLoans(results, accountData);
        })

        //get the users name
        accountData.name = req.user.name;

        //make the data up to two decimals
        accountData.netWorth.balance = Number.parseFloat(accountData.netWorth.balance).toFixed(2);
        accountData.credit.balance = Number.parseFloat(accountData.credit.balance).toFixed(2);
        //check to see if the information is correct
        res.send(accountData);
    });
}))

// @desc Trades public token for access token and stores credentials in database
router.post("/account/add", auth, asyncMiddleWare(async(req, res) => {
    //get the users public token from the client

    PUBLIC_TOKEN = req.body.public_token;

    const userId = req.user._id;
    const institution = req.body.metadata.institution;
    const { name, institution_id } = institution;

    if (PUBLIC_TOKEN) {
        const exchangeToken =  await client.exchangePublicToken(PUBLIC_TOKEN)
        ACCESS_TOKEN = exchangeToken.access_token, //exhange public token for access token
        ITEM_ID = exchangeToken.item_id //get item token

        //if there is a public token then check if the user already has an account
        const account = await Account.findOne({ userId: userId, institutionId: institution_id })
        if (account != null) {
            res.status(400).send("Account already exists");
        } 
        else {
            const newAccount = new Account({
                userId: userId,
                accessToken: ACCESS_TOKEN,
                itemId: ITEM_ID,
                institutionId: institution_id,
                institutionName: name
            });
            newAccount.save().then(account => res.json(account));
        }
    }
}))

// @desc Delete account with given id
router.delete("/accounts/:id", auth, (req, res) => {
    Account.findById(req.params.id)
        .then(account => {
            account.remove().then(response => res.json({ success: true }))
        })
})

// @desc Get all accounts linked with plaid for a specific user
//TODO: create interface and logic to add more than one bank account
router.get("/accounts", auth, (req, res) => {
    Account.find({ userId: req.user._id })
        .then(accounts => res.json(accounts))
        .catch(err => console.log(err));
})

// @desc Fetch transactions from past 30 days from all linked 
router.post("/accounts/transactions", auth, asyncMiddleWare(async(req, res, next) => {
    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const thirtyDaysAgo = now.subtract(30, "days").format("YYYY-MM-DD"); //getting up to 30 days of transactions

    //to store all of the transactions
    let transactions = [];

    //find the current user account information
    const account = await Account.findOne({ userId: req.user._id });
  
    ACCESS_TOKEN = account.accessToken;
    const institutionName = account.institutionName;

    const response = await client.getTransactions(ACCESS_TOKEN, thirtyDaysAgo, today)
    
    transactions.push({
        accountName: institutionName,
        transactions: response.transactions
    });  

    res.status(200).json(transactions);
}))



//This funciton gets the users networth
function getNetworth(results, accountData){
    if (results.type == "depository" || results.type == "brokerage") {
        if (results.balances.available != null) {
            accountData.netWorth.balance += results.balances.available;
        } else {
            accountData.netWorth.balance += results.balances.current;
        }
    }
}

//This function records the loans and subtracts credit and loans from networth
function getCreditAndLoans(results, accountData){
//if one of these two types then its apart of your credit
    if (results.type == "credit" || results.type == "loan") {
        if (results.balances.current != null) {
            accountData.credit.balance += results.balances.current; //add to debt
            accountData.netWorth.balance -= results.balances.current; //substract from networth
        }

        if (results.type == "credit") { //push to credit debt
            accountData.creditCards.push({
                official_name: results.official_name,
                current: results.balances.current,
                limit: results.balances.limit,
            })
        }

        if (results.type == "loan") { //push to loan debt 
            accountData.loans.push({
                name: results.name,
                current: results.balances.current
            })
        }
    }
}

module.exports = router;