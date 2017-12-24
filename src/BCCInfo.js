import CurrencyInfo from './CurrencyInfo';

/* global _ */

class BCCInfo extends CurrencyInfo {
    get shortName() {
        return 'BCH';
    }

    get fullName() {
        return 'Bitcoin Cash';
    }

    getTransactionURL(tx) {
        return 'https://bitcoincash.blockexplorer.com/tx/' + tx;
    };
}

export default BCCInfo;
