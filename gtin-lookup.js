"use strict";

const MAX_API_RETIES = 5;
var request = require('request');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiCall(url, callback, tries = 1) {
	request(url, function(err, response, body){
		var resp = {};
		if (!err) {
			resp.statusCode = response.statusCode; 
			if (response.statusCode == 429 && tries < MAX_API_RETIES) {
				sleep(1000).then(() => {
					return apiCall(url, callback, tries + 1);
				});
			} else if (response.statusCode == 200) {
				resp.serverError = false;
				try {
					resp.product = JSON.parse(body);
				} catch (e) {
					resp.serverError = true;
				}
				callback(resp);
			}
		} else {
			resp.serverError = true;
			resp.statusCode = 500; 
			callback(resp); 
		}
	});
}

class GTINLookup {
	constructor(key){
		this.api = 'https://api.ean-search.org/api?format=json&token=' + key;
	}

	gtinLookup(gtin, lang, callback) {
		apiCall(this.api + "&op=barcode-lookup&ean=" + gtin + "&language=" + lang, callback);
	}

	isbnLookup(isbn, callback) {
		apiCall(this.api + "&op=barcode-lookup&isbn=" + isbn, callback);
	}

	gtinSearch(name, lang, callback) {
		apiCall(this.api + "&op=product-search&name=" + encodeURI(name) + "&language=" + lang, callback);
	}

	gtinSimilarSearch(name, lang, callback) {
		apiCall(this.api + "&op=similar-product-search&name=" + encodeURI(name) + "&language=" + lang, callback);
	}

	gtinCategorySearch(name, categoryCode, lang, callback) {
		apiCall(this.api + "&op=category-search&name=" + encodeURI(name) + "&category=" + categoryCode + "&language=" + lang, callback);
	}

	gtinPrefixSearch(prefix, lang, page, callback) {
		apiCall(this.api + "&op=barcode-prefix-search&prefix=" + prefix + "&language=" + lang + "&page=" + page, callback);
	}

	gtinIssuingCountryLookup(gtin, callback) {
		apiCall(this.api + "&op=issuing-country&ean=" + gtin, callback);
	}

	gtinVerifyChecksum(gtin, callback) {
		apiCall(this.api + "&op=verify-checksum&ean=" + gtin, callback);
	}

	gtinBarcodeImage(gtin, width, height, callback) {
		apiCall(this.api + "&op=barcode-image&ean=" + gtin + "&width=" + width + "&height=" + height, callback);
	}

}

module.exports = GTINLookup;

