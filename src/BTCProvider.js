import CurrencyInfoProvider from './CurrencyInfoProvider';
import * as Bitcoin from '../node_modules/bitcoinjs-lib/src/index';

/* global _ */

const BLOCKS_TO_RETRIEVE = 1;
const REQUEST_DELAY = 500; // delay between requests to reduce load on API
// const SATOSHIS_IN_BTC = 100000000;


class BTCProvider extends CurrencyInfoProvider {
    API_HOST = 'https://blockexplorer.com/api';

    initialize(callback, callbackError) {
        super.initialize();

        this.get(`${this.API_HOST}/blocks?limit=${BLOCKS_TO_RETRIEVE}`)
            .then((response) => {
                let data = JSON.parse(response),
                    price = 1; // FIXME

                this.price = price;
                this.lastBlocks = data.blocks.map(block => block.hash);

                callback && callback(this.price);
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn('Cannot retrieve basic BTC info!');
            });
    }

    getCurrencyName = () => 'BTC';

    getTransactionsFromBlock(block, callback, callbackError) {
        this.get(`https://${this.API_SUFFIX}.blockdozer.com/insight-api/rawblock/${block}`)
            .then((response) => {
                const data = JSON.parse(response);
                const block = Bitcoin.Block.fromHex(data.rawblock);
                
                const tx = block.transactions[10];
                console.log(block);
                console.log(tx);
                console.log(tx.ins[0].script);
                console.log(tx.getId());
                console.log(Bitcoin.script);
                // const script = Bitcoin.script.decompile(tx.ins[0].script);
                const intype = Bitcoin.script.classifyInput(tx.ins[0].script, false);
                console.log(intype);
                var txb = Bitcoin.TransactionBuilder.fromTransaction(tx);
                txb.build();
                console.log(txb);

                // const ind = Bitcoin.script.pubkeyHash.input.decode(tx.ins[0].script);
                // console.log(ind);

                const txs = [];
                let result;


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
                console.warn(`Cannot retrieve latest ${this.getCurrencyName()} transactions!`);
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
                    root.getTransactionsFromBlock(root.lastBlocks[i], callback, callbackError);
                }, (i + 1) * REQUEST_DELAY);
            }
        }
    }
}

export default BTCProvider;
