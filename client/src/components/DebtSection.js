import React from 'react';
import "../styles/DebtSection.css";

export default function DebtSection({ name, amount }) {
    return (
        <div className="debtSectionContainer">
            <div>
                <h5 className="debt_data">{name}</h5>
                <h5 className="debt_data cash_amount">${amount}</h5>
            </div>
        </div>
    );
} 