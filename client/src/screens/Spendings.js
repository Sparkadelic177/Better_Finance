import React, { Component } from 'react';
import axios from 'axios'
import "../styles/Spendings.css"

class Spendings extends Component {

    constructor(props) {
        super();
        this.state = {
            payment: 0,
            travel: 0,
            transfer: 0,
            food: 0,
            recreational: 0,
            paymentPercent: "0%",
            travelPercent: "0%",
            transferPercent: "0%",
            foodPercent: "0%",
            recreationalPercent: "0%",
            budgetLocked: false,
        }
        this.saveBudget = this.saveBudget.bind(this);
    }

    componentWillMount() {
        if (sessionStorage.getItem("key") == null) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        axios.post("/api/plaid/accounts/transactions", null, { headers: { "x-auth-token": sessionStorage.getItem("key") } })
            .then(results => {
                results.data.map((result) => {
                    return (
                        //mapping all of the transaction type into categories
                        result.transactions.map((transaction) => {

                            switch (transaction.category[0]) {
                                case "Payment":
                                    this.setState(prevState => ({ payment: prevState.payment + transaction.amount }))
                                    break;
                                case "Travel":
                                    this.setState(prevState => ({ travel: prevState.travel + transaction.amount }))
                                    break;
                                case "Transfer":
                                    this.setState(prevState => ({ transfer: prevState.transfer + transaction.amount }))
                                    break;
                                case "Food and Drink":
                                    this.setState(prevState => ({ food: prevState.food + transaction.amount }))
                                    break;
                                case "Recreation":
                                    this.setState(prevState => ({ recreational: prevState.recreational + transaction.amount }))
                                    break;
                                default:
                                    break;
                            }
                        }))
                })
            })
            .catch(err => console.log(err));

        //this is getting the users budget from the database
        axios.get("/api/budget/getBudget", { headers: { "x-auth-token": sessionStorage.getItem('key') } })
            .then(result => {
                const data = result.data;
                return (
                    this.setState({
                        paymentPercent: data.payment,
                        travelPercent: data.travel,
                        transferPercent: data.transfer,
                        foodPercent: data.food,
                        recreationalPercent: data.recreational,
                        budgetLocked: true,
                    })
                )
            })
            .catch(err => console.log(err));
    }

    //this function saves the users input on the budget input 
    saveBudget() {
        //save on when the user locks the data
        if (!this.state.budgetLocked) {
            axios.post("/api/budget/saveBudget", {
                data: {
                    payment: this.state.paymentPercent,
                    travel: this.state.travelPercent,
                    transfer: this.state.transferPercent,
                    food: this.state.foodPercent,
                    recreational: this.state.recreationalPercent
                }
            },
                { headers: { "x-auth-token": sessionStorage.getItem("key") } })
                .then(result => console.log(JSON.stringify(result.data)))
                .catch(err => console.log(err))
        }

        //disable the inputs and change the button text
        this.setState(prevState => ({ budgetLocked: !prevState.budgetLocked }))
    }

    render() {

        const stateData = [
            this.state.payment,
            this.state.travel,
            this.state.transfer,
            this.state.food,
            this.state.recreational
        ]

        const statePercentage = [
            this.state.paymentPercent,
            this.state.travelPercent,
            this.state.transferPercent,
            this.state.foodPercent,
            this.state.recreationalPercent
        ]

        const categoryString = [
            "payment",
            "travel",
            "transfer",
            "food",
            "recreational"
        ]

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        const bugetHelper = (evt) => {
            //gets the state corresponding to the input and gets the percentage taken
            //from input
            let percent = (this.state[evt.target.name] / evt.target.value) * 100;
            percent = percent.toFixed(0);
            let data = evt.target.name + "Percent";
            if (evt.target.value === "") percent = 0;
            this.setState({ [data]: percent + "%" })
        }

        return (
            <div className="spendingContainer">
                <h1 className="">Here is where you will be able to keep track of all your spendings</h1>

                {stateData.map((object, index) => {
                    return (
                        <div style={{ width: "50%" }}>
                            <p className="category">{categoryString[index]}:{formatter.format(stateData[index])}</p>
                            <div className="bar_input">
                                <div className="progressbarContainer">
                                    <div className="progressbar" style={{ width: statePercentage[index] }}>
                                        {statePercentage[index]}
                                    </div>
                                </div>
                                <input className="budget-input" disabled={this.state.budgetLocked}
                                    style={{ display: this.state.budgetLocked ? "none" : "" }}
                                    placeholder="Budget" type="number" name={categoryString[index]}
                                    onChange={bugetHelper}
                                />
                            </div>
                        </div>

                    )
                })}

                <button onClick={this.saveBudget} className="budget_Btn" style={{ backgroundColor: this.state.budgetLocked ? "green" : "red" }}> {this.state.budgetLocked ? "Reset Budget" : "Lock Budget"} </button>
            </div>
        )
    }
}

export default Spendings;