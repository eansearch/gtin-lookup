"use strict";

var request = require('request');

class GTINLookup {
	constructor(key){
		this.api = 'https://api.ean-search.org/api?format=json&token=' + key;
	}

	apiCall(url, callback) {
		request(url, function(err, response, body){
			var resp = {};
			if (!err) {
				resp.statusCode = response.statusCode; 
				if (response.statusCode == 200) {
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

	gtinLookup(gtin, lang, callback) {
		this.apiCall(this.api + "&op=barcode-lookup&ean=" + gtin + "&lang=" + lang, callback);
	}

	isbnLookup(isbn, callback) {
		this.apiCall(this.api + "&op=barcode-lookup&isbn=" + isbn, callback);
	}

	gtinSearch(name, lang, callback) {
		this.apiCall(this.api + "&op=product-search&name=" + encodeURI(name) + "&lang=" + lang, callback);
	}

	gtinCategorySearch(name, categoryCode, lang, callback) {
		this.apiCall(this.api + "&op=category-search&name=" + encodeURI(name) + "&category=" + categoryCode + "&lang=" + lang, callback);
	}

	gtinPrefixSearch(prefix, lang, page, callback) {
		this.apiCall(this.api + "&op=barcode-prefix-search&prefix=" + prefix + "&lang=" + lang + "&page=" + page, callback);
	}

	gtinIssuingCountryLookup(gtin, callback) {
		this.apiCall(this.api + "&op=issuing-country&ean=" + gtin, callback);
	}

	gtinVerifyChecksum(gtin, callback) {
		this.apiCall(this.api + "&op=verify-checksum&ean=" + gtin, callback);
	}

	gtinBarcodeImage(gtin, callback) {
		this.apiCall(this.api + "&op=barcode-image&ean=" + gtin, callback);
	}

}

module.exports = GTINLookup;

