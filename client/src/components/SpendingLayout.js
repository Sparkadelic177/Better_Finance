import React from 'react';
import "../styles/Spendings.css";


//this helper changes the percentage bar when ever the user inputs a number on the input
const bugetHelper = (evt) => {
    //gets the state corresponding to the input and gets the percentage taken
    //from input
    let percent = (evt.target.name / evt.target.value) * 100;
    percent = percent.toFixed(0);
    let data = evt.target.name + "Percent";
    if (evt.target.value === "") percent = 0;
    // this.setState({ [data]: percent + "%" })
}

//used to format the numbers in to currency 
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

const SpendingSection = ({ payment, width, percent, food, budgetLocked, categoryString }) => {

    return (
        <div style={{ width: "50%" }}>
            <p className="category">{categoryString}:{formatter.format(payment)}</p>
            <div className="bar_input">
                <div className="progressbarContainer">
                    <div className="progressbar" style={{ width: percent }}>
                        {percent}
                    </div>
                </div>
                <input className="budget-input" disabled={budgetLocked}
                    style={{ display: budgetLocked ? "none" : "" }}
                    placeholder="Budget" type="number" name={categoryString}
                    onChange={bugetHelper}
                />
            </div>
        </div>
    )
}

export default SpendingSection;
