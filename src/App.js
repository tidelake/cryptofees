import React, { Component } from 'react';

import FeeVisualizer from './FeeVisualizer';
import BTCProvider from './BTCProvider';
import ETHProvider from './ETHProvider';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minAmount: 20,
            maxAmount: 120
        };

        this.providerBTC = new BTCProvider();
        this.providerETH = new ETHProvider();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">

    <form className="form-inline" onSubmit={this.handleSubmit}>
      <div className="form-group">
        <label htmlFor="inputMinAmount">Min</label>
        <input type="number" className="form-control" id="inputMinAmount" placeholder="Min Amount" defaultValue={this.state.minAmount} ref={(input) => this.inputMin = input} />
      </div>
      <div className="form-group">
        <label htmlFor="inputMaxAmount">Max</label>
        <input type="number" className="form-control" id="inputMaxAmount" placeholder="Max Amount" defaultValue={this.state.maxAmount} ref={(input) => this.inputMax = input} />
      </div>
      <button type="submit" className="btn btn-default">Compare fees</button>
    </form>

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FeeVisualizer minAmount={this.state.minAmount} maxAmount={this.state.maxAmount} provider={this.providerBTC} />
                    </div>
                    <div className="col-md-6">
                        <FeeVisualizer minAmount={this.state.minAmount} maxAmount={this.state.maxAmount} provider={this.providerETH} />
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
