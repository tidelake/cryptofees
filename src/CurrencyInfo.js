class CurrencyInfo {
    get shortName() {
        return 'USD';
    }

    get fullName() {
        return 'US Dollar';
    }

    get lastUpdated() {
        return this.lastUpdatedTime;
    }

    get(url) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
            req.onerror = (e) => reject(Error(`Network Error: ${e}`));
            req.send();
        });
    }

    getData(callback, callbackError) {
        this.get(`/data/${this.shortName}.json`)
            .then((response) => {
                const data = JSON.parse(response);
                const transactions = data.transactions.map(tx => ({
                    id: tx.id,
                    amount: tx.amount,
                    fee: tx.fee,
                    amountUSD: tx.amount * data.price,
                    feeUSD: tx.fee * data.price,
                    percentage: tx.fee / (tx.fee + tx.amount) * 100
                }));
                data.transactions = transactions;
                this.lastUpdatedTime = data.lastUpdated;
                callback && callback(data);
            })
            .catch((err) => {
                callbackError && callbackError();
                console.warn(`Cannot retrieve ${this.fullName} info!`);
            });
    }

    initialize() {
        console.log(`Initialized ${this.shortName}`);
    }

    getTransactionURL(tx) {
        return tx;
    };

    get logoSVG() {
        return "";
    }
}

export default CurrencyInfo;
