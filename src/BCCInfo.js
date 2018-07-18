import CurrencyInfo from './CurrencyInfo';

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

    get logoSVG() {
        return '<svg xmlns="http://www.w3.org/2000/svg" height="64" width="104"><path d="M0 0h29.7a39 39 0 0 0 0 64H0zm52 0a32 32 0 0 0 0 64 32 32 0 0 0 0-64m52 0H74.3a39 39 0 0 1 0 64H104z" fill="#F7931A"/><path d="M62.3 21.4c-1.4-4.1-5.4-4.6-10-3.9L51 11.8l-3.5.8 1.4 5.7-2.8.7-1.4-5.7-3.6 1 1.5 5.7-2.2.6-4.9 1.2 1 3.7 2.5-.6c1.4-.4 2 .3 2.4 1l1.6 6.6a3 3 0 0 1 .4 0H43l2.3 9.2c0 .5 0 1.2-1 1.5l-2.5.6.3 4.4 4.6-1.1c.8-.3 1.7-.4 2.5-.6l1.4 5.8 3.5-.9-1.4-5.8 2.8-.6 1.5 5.7 3.5-.9-1.5-5.8c5.8-1.8 9.6-4.3 8.7-10-.7-4.6-3.3-6-6.8-6 1.8-1.5 2.6-3.7 1.5-6.6zM60.5 35c1.1 4.3-6.5 5.7-8.9 6.3l-1.9-7.8c2.4-.5 9.7-3 10.8 1.5zm-4.3-10.5c1 4-5.4 5-7.4 5.5l-1.7-7c2-.5 8-2.7 9 1.5z" fill="#FFF"/></svg>';
    }
}

export default BCCInfo;
