import CurrencyInfoProvider from './CurrencyInfoProvider';

/* global _ */

const BLOCKS_TO_RETRIEVE = 8;

class BTCProvider extends CurrencyInfoProvider {
    initialize(callback, callbackError) {
        super.initialize();

        this.get('http://btc.blockr.io/api/v1/coin/info')
            .then((response) => {
                let data = JSON.parse(response),
                    price = _.chain(data.data.markets).toArray().meanBy('value').value();

                this.price = price;
                this.lastBlock = data.data.last_block.nb;

                callback && callback(this.price);
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn('Cannot retrieve basic BTC info!');
            });
    }

    getCurrencyName = () => 'BTC';

    getTransactionURL(tx) {
        return 'https://blockchain.info/tx/' + tx;
    };

    getLastTransactions(callback, callbackError) {
        let blocks = (new Array(BLOCKS_TO_RETRIEVE).fill(0).map((item, index) => this.lastBlock - index));

        this.get('http://btc.blockr.io/api/v1/block/txs/' + blocks.join(','))
            .then((response) => {
                let data = JSON.parse(response),
                    txs = _.flatMap(data.data, 'txs'),
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

                callback && callback(result);
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn('Cannot retrieve latest BTC transactions!');
            });
    }
}

export default BTCProvider;
