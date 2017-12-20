const CurrencyInfoProvider = require('./CurrencyInfoProvider');
const _ = require('lodash');

const BLOCKS_TO_RETRIEVE = 8;
const REQUEST_DELAY = 500; // delay between requests to reduce load on etherchain API

class ETHProvider extends CurrencyInfoProvider {

    initialize(callback, callbackError) {
        super.initialize();

        this.get('https://etherchain.org/api/basic_stats')
            .then((response) => {
                let data = JSON.parse(response);

                this.price = data.currentStats.price_usd;
                this.lastBlock = data.blocks[0].number;

console.log(this.price);
console.log(this.lastBlock);

                callback && callback(this.price);
            })
            .catch((err) => {
                console.log(err);
                callbackError && callbackError();
                console.warn('Cannot retrieve basic ETH info!');
            });
    }

    getCurrencyName() {
        return 'ETH';
    }

    getTransactionURL(tx) {
        return 'https://etherscan.io/tx/' + tx;
    }

    getTransactionsFromBlock(block, callback, callbackError) {
        this.get('https://etherchain.org/api/block/' + block + '/tx')
            .then((response) => {
                let data = JSON.parse(response),
                    txs = data.data,
                    result;

                this.retrievedTransactions = this.retrievedTransactions.concat(txs);
                this.counter++;

                if (this.counter === BLOCKS_TO_RETRIEVE) {
                    result = _.chain(this.retrievedTransactions)
                        .filter((tx) => {
                            return tx.amount > 0 && tx.gasUsed === 21000
                        })
                        .map((tx, index) => {
                            let amount = tx.amount / 1000000000000000000,
                                fee = tx.gasUsed * (tx.price / 1000000000000000000),
                                feeUSD = fee * this.price;

                            return {
                                id: tx.hash,
                                amount: amount,
                                amountUSD: amount * this.price,
                                gasUsed: tx.gasUsed,
                                gasPrice: tx.price / 1000000000000000000,
                                fee: fee,
                                feeUSD: feeUSD,
                                percentage: fee / (fee + amount) * 100
                            };
                        })
                        .value();

                    this.lastUpdatedTimestamp = new Date().getTime();
                    this.transactions = result;
                    callback && callback(this.transactions);
                }
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn('Cannot retrieve latest ETH transactions!');
            });
    }

    getLastTransactions(callback, callbackError) {
        let root = this;

        if (this.transactions && (new Date().getTime() - this.lastUpdatedTimestamp < this.CACHE_TIMEOUT)) {
            callback && callback(this.transactions);
        } else {
            this.transactions = null;
            this.retrievedTransactions = [];
            this.counter = 0;

            for (let i = 0; i < BLOCKS_TO_RETRIEVE; i++) {
                setTimeout(function() {
                    root.getTransactionsFromBlock(root.lastBlock - i, callback, callbackError);
                }, (i + 1) * REQUEST_DELAY);
            }
        }
    }
}

module.exports = ETHProvider;
