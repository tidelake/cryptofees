'use strict';

const fs = require('fs');

const ETHProvider = require('./ETHProvider');
const BTCProvider = require('./BTCProvider');
const BCCProvider = require('./BCCProvider');

const PATH_TO_RESULT = 'build/data';

function getData(provider) {
	let currencyPrice;

	provider.initialize(price => {
	    provider.getLastTransactions(txs => {
			fs.writeFile(`${PATH_TO_RESULT}/${provider.getCurrencyName()}.json`,
				JSON.stringify({
					currency: provider.getCurrencyName(),
					price: price,
					lastUpdated: new Date().toUTCString(),
					transactions: txs
				}),
				error => {
			    	if (error) {
			    		console.error(error);
			    	}
			    }
			);
	    },
	    () => {
	    	console.warn(`Error retrieving data for ${provider.getCurrencyName()}`);
	    });
	},
	() => {
	    console.warn(`Cannot initialize ${provider.getCurrencyName()}!`)
	});
}

const providerETH =  new ETHProvider();
const providerBTC =  new BTCProvider();
const providerBCC =  new BCCProvider();

getData(providerBTC);
getData(providerBCC);

// console.log(CurrencyInfoProvider.prototype.initialize);
// console.log(new ETHProvider().getCurrencyName());

// process.exit(0);
