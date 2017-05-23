import CurrencyInfoProvider from './CurrencyInfoProvider';

/* global _ */

class BTCProvider extends CurrencyInfoProvider {
    initialize(callback) {
        super.initialize();

        this.get('http://btc.blockr.io/api/v1/coin/info')
            .then((response) => {
                let data = JSON.parse(response),
                    price = _.chain(data.data.markets).toArray().meanBy('value').value();

                this.price = price;

                callback && callback(this.price);
            })
            .catch((err) => {
                console.warn('Cannot retrieve basic BTC info!');
            });
    }

    getCurrencyName = () => 'BTC';

    getTransactionURL(tx) {
        return 'https://blockchain.info/tx/' + tx;
    };

    getLastTransactions(callback) {
        this.get('http://btc.blockr.io/api/v1/block/txs/last')
            .then((response) => {
                let data = JSON.parse(response),
                    txs = data.data.txs,
                    result = txs.map((tx, index) => {
                        let sumOut = _.sumBy(tx.trade.vouts, 'amount');

                        return {
                            id: tx.tx,
                            fee: +tx.fee,
                            amount: sumOut,
                            feeUSD: tx.fee * this.price,
                            amountUSD: sumOut * this.price,
                            percentage: (+tx.fee) / ((+sumOut) + (+tx.fee)) * 100
                        };
                    });

                    // console.log(txs.length);

                callback && callback(result);
            })
            .catch((err) => {
                console.warn('Cannot retrieve latest BTC transactions!');
            });
    }
}

export default BTCProvider;
