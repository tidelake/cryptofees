const XMLHttpRequest = require('xhr2');

class CurrencyInfoProvider {
    get(url) {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
        req.onerror = (e) => reject(Error(`Network Error: ${e}`));
        req.send();
      });
    }

    initialize() {
        this.lastUpdatedTimestamp = 0;
        console.log('Initialized ' + this.constructor.name);
    }

    getLastTransactions(callback) {
    }

    constructor() {
        this.CACHE_TIMEOUT = 1000 * 60 * 20; // cache txs for 20 minutes
    }
}

module.exports = CurrencyInfoProvider;
