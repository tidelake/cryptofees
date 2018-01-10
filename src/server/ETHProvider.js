const CurrencyInfoProvider = require('./CurrencyInfoProvider');
const _ = require('lodash');

const TRANSACTIONS_TO_RETRIEVE = 80;
const REQUEST_DELAY = 2800; // delay between requests to reduce load on blockcypher.com API
const MAX_FAILED_REQUESTS = 5;

class ETHProvider extends CurrencyInfoProvider {
    initialize(callback, callbackError) {
        super.initialize();

        this.transactions = [];

        this.get(this.basicInfoURL)
            .then(response => {
                const data = JSON.parse(response);
                this.price = +data[0].price_usd;

                setTimeout(() => {
                    this.get(this.basicBlockchainInfoURL)
                        .then(response => {
                            const data = JSON.parse(response);
                            this.height = data.height;

                            console.log(`Retrieved basic info for ${this.getCurrencyName()}`);
                            callback && callback(this.price);
                        })
                        .catch((err) => {
                            callbackError && callbackError();
                            console.warn('Cannot retrieve basic ETH info!');
                        });
                }, REQUEST_DELAY);
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn('Cannot retrieve ETH price!');
            });
    }

    get maxFailedRequests() {
        return MAX_FAILED_REQUESTS;
    }

    get basicInfoURL() {
        return 'https://api.coinmarketcap.com/v1/ticker/ethereum/';
    }

    get basicBlockchainInfoURL() {
        return 'https://api.blockcypher.com/v1/eth/main';
    }

    getCurrencyName() {
        return 'ETH';
    }

    getTransactionURL(tx) {
        return 'https://etherscan.io/tx/' + tx;
    }

    get transactionsPerRequest() {
        return 3;
    }

    get apiURL() {
        return 'https://api.blockcypher.com/v1/eth/main';
    }

    getTransactionsURL(callbackGetTransactions, callbackDone, callbackError) {
        this.get(`${this.apiURL}/blocks/${this.currentBlock}?txstart=0&limit=1000`)
            .then(response => {
                const data = JSON.parse(response);
                for (let i = 0; i < data.txids.length; i += this.transactionsPerRequest) {
                    const txs = [];

                    for (let j = 0; j < this.transactionsPerRequest; j++) {
                        const tx = data.txids[i + j];
                        if (tx) {
                            txs.push(tx);
                        }
                    }

                    this.transactionURLs.push(`${this.apiURL}/txs/${txs.join(';')}`);
                    this.preparedTransactionsCount += this.transactionsPerRequest;

                    if (this.preparedTransactionsCount >= TRANSACTIONS_TO_RETRIEVE) {
                        break;
                    }
                }

                this.currentBlock--;

                if (this.preparedTransactionsCount < TRANSACTIONS_TO_RETRIEVE) {
                    setTimeout(
                        () => { this.getTransactionsURL(callbackGetTransactions, callbackDone, callbackError); },
                        REQUEST_DELAY
                    );
                } else {
                    callbackGetTransactions(this.transactionURLs, callbackDone, callbackError);
                }
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn('Cannot retrieve basic ETH info!');
            });
    }

    prepareTransactionURLs(callbackGetTransactions, callbackDone, callbackError) {
        this.transactionURLs = [];
        this.preparedTransactionsCount = 0;
        this.currentBlock = this.height;

        this.getTransactionsURL(callbackGetTransactions, callbackDone, callbackError);
    }

    getTransactions(urls, callbackDone, callbackError) {
        let currentURLindex = 0;
        let failedRequestsCount = 0;

        const getTransactionsBatch = () => {
            const url = urls[currentURLindex];

            this.get(url)
                .then(response => {
                    const data = JSON.parse(response);

                    data.forEach(tx => {
                        const amount = tx.total / 1000000000000000000;
                        const fee = tx.fees / 1000000000000000000;

                        if (tx.gas_used === 21000) {
                            this.transactions.push({
                                id: tx.hash,
                                amount,
                                amountUSD: amount * this.price,
                                fee,
                                feeUSD: fee * this.price,
                                percentage: fee / (fee + amount) * 100
                            });
                        }
                    });

                    currentURLindex++;
                    if (currentURLindex < urls.length) {
                        setTimeout(() => { getTransactionsBatch(); }, REQUEST_DELAY);
                    } else {
                        callbackDone(this.transactions);
                    }
                })
                .catch((err) => {
console.log(currentURLindex, url)
console.log(err)
                    failedRequestsCount++;
                    if (failedRequestsCount >= this.maxFailedRequests) {
                        callbackError && callbackError();
                    } else {
                        currentURLindex++;
                        if (currentURLindex < urls.length) {
                            setTimeout(() => { getTransactionsBatch(); }, REQUEST_DELAY);
                        } else {
                            callbackDone(this.transactions);
                        }
                    }
                });
        }

        getTransactionsBatch();

        // console.log(urls);
    }

    getLastTransactions(callback, callbackError) {
        this.prepareTransactionURLs(this.getTransactions.bind(this), callback, callbackError);
    }
}

module.exports = ETHProvider;
