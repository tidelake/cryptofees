import React, { Component } from 'react';

class Transaction extends Component {
    render() {
        return (
            <tr>
                <td>{(+this.props.amountUSD).toFixed(2)}</td>
                <td>{(+this.props.feeUSD).toFixed(2)}</td>
                <td>{+this.props.percentage.toFixed(4)}%</td>
                <td>
                    <a href={this.props.url} target="_blank" className="btn btn-default btn-xs">
                        <span className="hidden-xs">Transaction</span> Details
                    </a>
                </td>
            </tr>
        );
    }
}

export default Transaction;
