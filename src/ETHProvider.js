import CurrencyInfoProvider from './CurrencyInfoProvider';

/* global _ */

const BLOCKS_TO_RETRIEVE = 5;

class ETHProvider extends CurrencyInfoProvider {

    initialize(callback) {
        super.initialize();

        this.get('https://etherchain.org/api/basic_stats')
            .then((response) => {
                let data = JSON.parse(response);

                this.price = data.data.price.usd;
                this.lastBlock = data.data.blockCount.number;

                callback && callback(this.price);
            })
            .catch((err) => {
                console.warn('Cannot retrieve basic ETH info!');
            });
    }

    getCurrencyName = () => 'ETH';

    getTransactionURL(tx) {
        return 'https://etherscan.io/tx/' + tx;
    };

    getTransactionsFromBlock(block, callback) {
        this.get('https://etherchain.org/api/block/' + block + '/tx')
            .then((response) => {
                let data = JSON.parse(response),
                    txs = data.data,
                    result;

                this.transactions = this.transactions.concat(txs);
                this.counter++;

                if (this.counter === BLOCKS_TO_RETRIEVE) {
                    // console.log(this.transactions);
                    result = _.chain(this.transactions)
                        .filter((tx) => {
                            return tx.amount > 0 && tx.gasUsed > 0
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
                    callback && callback(result);
                    // console.log(result);
                }
            })
            .catch((err) => {
                console.warn('Cannot retrieve latest ETH transactions!');
            });
    }

    getLastTransactions(callback) {
        this.transactions = [];
        this.counter = 0;

console.log(this.price);
console.log(this.lastBlock);

        for (let i = 0; i < BLOCKS_TO_RETRIEVE; i++) {
            this.getTransactionsFromBlock(this.lastBlock - i, callback);
        }
    }
}

export default ETHProvider;
