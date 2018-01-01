import CurrencyInfo from './CurrencyInfo';

class ETHInfo extends CurrencyInfo {
    get shortName() {
        return 'ETH';
    }

    get fullName() {
        return 'Ether';
    }

    getTransactionURL(tx) {
        return 'https://etherscan.io/tx/0x' + tx;
    }
}

export default ETHInfo;
