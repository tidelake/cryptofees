const CurrencyInfoProvider = require('./CurrencyInfoProvider');
const _ = require('lodash');

const TRANSACTIONS_TO_RETRIEVE = 2000;
const BLOCKS_TO_RETRIEVE = 10;
const REQUEST_DELAY = 1500; // delay between requests to reduce load on API
const TRANSACTIONS_PER_PAGE = 10;

class BTCProvider extends CurrencyInfoProvider {
    initialize(callback, callbackError) {
        super.initialize();

        this.get(this.basicInfoURL)
            .then(response => {
                const data = JSON.parse(response);
                this.price = +data[0].price_usd;

                this.get(`${this.apiURL}/blocks?limit=${this.blocksCount}`)
                    .then(response => {
                        console.log(`Retrieved basic info for ${this.getCurrencyName()}`);

                        const data = JSON.parse(response);

                        this.lastBlocks = data.blocks;
                        this.requestURLs = this.getRequests();

                        callback && callback(this.price);
                    })
                    .catch(error => {
                        callbackError && callbackError();
                        console.warn('Cannot retrieve basic BTC info!');
                    });
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn('Cannot retrieve basic BTC info!');
            });
    }

    get transactionsCount() {
        return TRANSACTIONS_TO_RETRIEVE;
    }

    get blocksCount() {
        return BLOCKS_TO_RETRIEVE;
    }

    get requestDelay() {
        return REQUEST_DELAY;
    }

    get transactionsPerPage() {
        return TRANSACTIONS_PER_PAGE;
    }

    get apiURL() {
        return 'https://insight.bitpay.com/api';
        // 'https://blockexplorer.com/api';
    }

    get basicInfoURL() {
        return 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';
    }

    getCurrencyName() {
        return 'BTC';
    }

    getRequests() {
        const result = [];
        this.lastBlocks.forEach(block => {
            for (let i = 0; i < block.txlength / this.transactionsPerPage - 1;  i++) {
                if (result.length > this.transactionsCount / TRANSACTIONS_PER_PAGE) {
                    return;
                }
                result.push(`${this.apiURL}/txs?block=${block.hash}&pageNum=${i}`);
            }
        });
        return result;
    }

    getTransactionsFromBlock(url, callback, callbackError) {
        this.get(url)
            .then(response => {
// console.log("retrieved ", url)
                try {
                    const data = JSON.parse(response);

                    const txs = data.txs;
                    let result;

                    this.retrievedTransactions = this.retrievedTransactions.concat(txs);
                    this.counter++;

                    if (this.counter >= this.requestURLs.length) {
                        result = _.chain(this.retrievedTransactions)
                            .filter(tx => !tx.isCoinBase)
                            .map((tx, index) => {
                                let amount = tx.valueOut,
                                    fee = tx.fees,
                                    feeUSD = fee * this.price;

                                return {
                                    id: tx.txid,
                                    amount: amount,
                                    amountUSD: amount * this.price,
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
                } catch (error) {
                    console.warn(error);
                    callbackError && callbackError();
                }
            })
            .catch(err => {
                console.warn(`Cannot retrieve ${this.getCurrencyName()} transactions from ${url}`);
                console.log(err);
                callbackError && callbackError();
            });
    }

    getLastTransactions(callback, callbackError) {
        const root = this;

        if (this.transactions && (new Date().getTime() - this.lastUpdatedTimestamp < this.CACHE_TIMEOUT)) {
            callback && callback(this.transactions);
        } else {
            this.transactions = null;
            this.retrievedTransactions = [];
            this.counter = 0;

            for (let i = 0; i < this.requestURLs.length; i++) {
                setTimeout(function() {
                    root.getTransactionsFromBlock(root.requestURLs[i], callback, callbackError);
                }, (i + 1) * this.requestDelay);
            }
        }
    }
}

module.exports = BTCProvider;
