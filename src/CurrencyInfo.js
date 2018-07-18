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
