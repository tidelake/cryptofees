const BTCProvider = require('./BTCProvider');

class BCCProvider extends BTCProvider {
    getCurrencyName() {
        return 'BCH';
    }

    get apiURL() {
        return 'https://bitcoincash.blockexplorer.com/api';
    }

    get basicInfoURL() {
        return 'https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/';
    }

    get blocksCount() {
        return 100;
    }

    get transactionsCount() {
        return 2000;
    }    
}

module.exports = BCCProvider;
