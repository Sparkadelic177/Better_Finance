import React from 'react';
import axios from 'axios';
import DashboardSection from "../components/DashboardSection"
import "../styles/Dashboard.css";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            transactions: [],
            balance: 0,
        }
        this.init = this.init.bind(this)
    }

    //checking if the user is logged in yet
    componentWillMount() {
        if (sessionStorage.getItem("key") == null) {
            this.props.history.push('/');
        }
    }

    //call for the users transactions
    componentDidMount() {
        try{ 
            this.init();
        }
        catch(err){
            console.log(err)
        }
    }

    async init(){
        const header = {headers: { "x-auth-token": sessionStorage.getItem("key")}};
        
        const results = await Promise.all([
            axios.post("/api/plaid/account/balance", null,header),
            axios.post("/api/plaid/accounts/transactions", null,header)
        ])

        this.setState({
            balance: results[0].data.netWorth.balance,
            name: results[0].data.name
        })

        const transactions = results[1].data.map(result => result.transactions );
        this.setState({ transactions: transactions[0]})

    }


    render() {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })
        const { name, balance } = this.state;
        return (
            <div className="dashboardContainer">
                <section className="dashBoard-top">
                    <div className="dashBoard-header">
                        <div className="dashBoard-leftSide">
                            <h3 className="dashBoard-h3"> Hello, </h3>
                            <h1 className="dashBoard-h1"> {name} </h1>
                        </div>
                        <div className="dashBoard-rightSide">
                            <h3 className="dashBoard-h3"> networth, </h3>
                            <h1 className="dashBoard-h1"> {formatter.format(balance)} </h1>
                        </div>
                    </div>
                </section>
                <section className="chart">
                    <table border="5" width="100%" cellPadding="4" cellSpacing="3">
                        <tbody >
                            <tr>
                                <th colSpan="3"><h2>Account History</h2></th>
                            </tr>
                            <tr>
                                <th> Date </th>
                                <th> Category </th>
                                <th> Amount </th>
                            </tr>
                            {this.state.transactions.map((items, key) => {
                                let category = "";
                                //data is the index and items.category is the object
                                for (var data in items.category) {
                                    category = items.category[data];
                                    break; //so that it only grabs the first category type
                                }
                                return (
                                    <DashboardSection
                                        key={key}
                                        date={items.date}
                                        category={category}
                                        amount={formatter.format(items.amount)}
                                    />
                                )

                            })}
                        </tbody>
                    </table>
                </section>
                <section>

                </section>
            </div>
        )
    }
}

export default Dashboard;