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

    get logoSVG() {
        return '<svg width="256" height="417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path fill="rgb(52, 52, 52)" d="M128 0l-3 10v275l3 3 128-76"/><path fill="rgb(140, 140, 140)" d="M128 0L0 212l128 76V154"/><path fill="rgb(60, 60, 59)" d="M128 312l-2 2v98l2 5 128-180"/><path fill="rgb(140, 140, 140)" d="M128 417V312L0 237"/><path fill="rgb(20, 20, 20)" d="M128 288l128-76-128-58"/><path fill="rgb(57, 57, 57)" d="M0 212l128 76V154"/></svg>';
    }
}

export default ETHInfo;
