import React, { Component } from 'react';

class Transaction extends Component {
    render() {
        return (
            <div>
                <a href={this.props.url} target="_blank">
                    {(+this.props.amountUSD).toFixed(2)}
                    {' / '}
                    {(+this.props.feeUSD).toFixed(2)}
                    {' / '}
                    {+this.props.percentage.toFixed(4)}%
                </a>
            </div>
        );
    }
}

export default Transaction;
