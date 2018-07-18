import CurrencyInfo from './CurrencyInfo';

class BTCInfo extends CurrencyInfo {
    get shortName() {
        return 'BTC';
    }

    get fullName() {
        return 'Bitcoin';
    }

    getTransactionURL(tx) {
        return 'https://blockchain.info/tx/' + tx;
    };

    get logoSVG() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 1 1" preserveAspectRatio="xMidYMid"><path d="M63.036 39.74C58.762 56.885 41.4 67.318 24.254 63.043 7.116 58.768-3.316 41.404.96 24.262 5.23 7.117 22.593-3.318 39.733.957 56.878 5.23 67.31 22.597 63.036 39.74z" fill="#f9aa4b" transform="scale(.01563)"/><path d="M.72.43C.73.36.68.326.61.302l.023-.09L.578.2.556.286.512.277l.022-.09L.48.175l-.023.09L.422.256.346.236l-.014.06.04.01c.022.005.026.02.025.03l-.06.248C.332.59.326.6.31.597L.27.587.244.65l.072.018.04.01-.024.09.056.015.022-.09c.015.004.03.008.044.01L.43.794.485.81l.022-.09C.6.733.67.727.7.642.726.573.7.535.65.51.686.5.713.477.72.43zM.596.604C.578.673.463.635.425.627l.03-.12c.04.008.158.027.14.098zM.612.428C.597.49.502.458.47.45L.498.34c.03.01.13.023.114.088z" fill="#fff"/></svg>';
    }
}

export default BTCInfo;
