import React, { Component } from 'react';

import FeeVisualizer from './FeeVisualizer';

import BTCInfo from './BTCInfo';
import BCCInfo from './BCCInfo';
import ETHInfo from './ETHInfo';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minAmount: 20,
            maxAmount: 200
        };

        this.infoBTC = new BTCInfo();
        this.infoBCC = new BCCInfo();
        this.infoETH = new ETHInfo();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <p className="hidden-xs"><i>Enter minimum and maximum amount in USD to compare BTC, BCH and ETH fees for transactions in provided range.</i></p>
                <p className="hidden-sm hidden-md hidden-lg"><i>Enter min &amp; max transaction amount to compare BTC, BCH and ETH fees in provided range.</i></p>
                <div className="row">
                    <div className="col-md-12">
                        <form className="form-inline" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                            <label htmlFor="inputMinAmount">Min Amount:</label>
                            {" "}
                            <input type="number" className="form-control narrow-input" id="inputMinAmount" placeholder="Min Amount" defaultValue={this.state.minAmount} ref={(input) => this.inputMin = input} />
                            {" "}
                            <span className="hidden-xs">USD;</span>
                            {" "}
                            </div>
                            {" "}
                            <div className="form-group">
                            <label htmlFor="inputMaxAmount">Max Amount: </label>
                            {" "}
                            <input type="number" className="form-control narrow-input" id="inputMaxAmount" placeholder="Max Amount" defaultValue={this.state.maxAmount} ref={(input) => this.inputMax = input} />
                            {" "}
                            <span className="hidden-xs">USD</span>
                            {" "}
                            </div>
                            {" "}
                            <button type="submit" className="btn btn-primary">Compare fees</button>
                        </form>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-6">
                        <FeeVisualizer minAmount={this.state.minAmount} maxAmount={this.state.maxAmount} provider={this.infoBTC} />
                    </div>
                    <div className="col-md-6">
                        <FeeVisualizer minAmount={this.state.minAmount} maxAmount={this.state.maxAmount} provider={this.infoBCC} />
                    </div>
                    <div className="col-md-6">
                        <FeeVisualizer minAmount={this.state.minAmount} maxAmount={this.state.maxAmount} provider={this.infoETH} />
                    </div>
                </div>
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            minAmount: +this.inputMin.value,
            maxAmount: +this.inputMax.value
        });
    }
}

export default App;
