import React, { Component } from 'react';
import axios from 'axios';
import DebtSection from "../components/DebtSection.js"
import "../styles/Debt.css";


class Debt extends Component {

    constructor(props) {
        super();
        this.state = {
            debt: 0,
            debts: [],
            debtDetail: [],
            calculatedDebt: [],
            calulated: false
        }

        this.infoPlacerInterest = this.infoPlacerInterest.bind(this);
        this.infoPlacerPayment = this.infoPlacerPayment.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    //checking if the user is logged in yet before the screen loads
    //if not then send this user to the home page
    componentWillMount() {
        if (sessionStorage.getItem("key") == null) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        axios.post("/api/plaid/account/balance", null,
            {
                headers: { "x-auth-token": sessionStorage.getItem("key") }
            }).then((results) => {
                this.setState({
                    debt: results.data.credit.balance,
                    creditCards: [...results.data.creditCards],
                    loans: [...results.data.loans],
                    debts: [...results.data.creditCards, ...results.data.loans],
                })

                this.state.debts.map((info) => {
                    return (
                        this.state.debtDetail.push({
                            name: info.official_name || info.name,
                            current: info.current,
                            interest: 0,
                            payment: 0,
                            accuredInterest: 0,
                            months: 0,
                        })
                    )
                });
            }).catch((err) => console.log(err));
    }


    //this infomation is send to the server and sends back some data
    calculate(evt) {

        axios.post("/api/debt", { data: this.state.debtDetail }, {
            headers: { "x-auth-token": sessionStorage.getItem("key") },
        }).then(results => {
            console.log(results.data)
            this.setState({ calculatedDebt: [...results.data] });
        })
            .catch(err => console.log(err))

        //toggle the button text
        this.setState(prevState => ({ calculated: !prevState.calculated }));


    }

    //helper to set the interest for certain account
    infoPlacerInterest(evt) {
        //find the object name with the same name
        this.state.debtDetail.forEach((object) => {
            if (evt.target.name === object.name) {
                object.interest = evt.target.value;
            }
        })
    }

    //helper to set the payment for a certain account
    infoPlacerPayment(evt) {
        //find the object name with the same name
        this.state.debtDetail.forEach((object) => {
            if (evt.target.name === object.name) {
                object.payment = evt.target.value;
            }
        })
    }

    render() {

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        const { debt, debts, calculated, calculatedDebt } = this.state;
        return (
            <div className="debtContainer">
                <div className="debtAmount">
                    <h3>Your Debt,</h3>
                    <h1>{formatter.format(debt)}</h1>
                </div>
                <section className="debtCalculation">
                    <div style={{ display: calculated ? "none" : "flex", flexDirection: "column" }}>
                        {debts.map((info, key) => {
                            return (
                                <div key={key}>
                                    <DebtSection
                                        name={info.official_name || info.name}
                                        amount={info.current}
                                    />
                                    <div className="inputs">
                                        <input name={info.official_name || info.name} className="debt_input" type="number" placeholder="minimum payment" onChange={this.infoPlacerPayment} />
                                        <input name={info.official_name || info.name} className="debt_input" type="number" placeholder="interest rate" onChange={this.infoPlacerInterest} required />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="calculated_debt" style={{ display: calculated ? "flex" : "none" }}>
                        {calculatedDebt.map((data, key) => {
                            return (
                                <div key={key}>
                                    <p className="debt_data debt_name">{data.name}</p>
                                    <p className="debt_data">Interest paid: ${data.accuredInterest.toFixed(2)}</p>
                                    <p className="debt_data">Months: {data.months}</p>
                                </div>
                            )
                        })}
                    </div>
                    <button className="debt_btn" onClick={this.calculate}> {calculated ? "new calculation" : "calculate"} </button>
                </section>

            </div>
        )
    }
}

export default Debt;