# gtin-lookup

A Javascript modult to lookup GTINs, EANs or ISBNs using the API on ean-search.org

## Install

`npm install gtin-lookup`

## Usage

```javascript

var GTINLookup = require("gtin-lookup");

const apiToken = "abcdef";
var gtinLookup = new GTINLookup(apiToken);

// lookup GTIN, prefer English (1) name
const gtin = "5099750442227";
gtinLookup.gtinLookup(gtin, 1, function(response){
	if (!response.serverError) {
		console.log("gtinLookup()");
		if (response.product != undefined) {
    		console.log("GTIN " + gtin + " is " + response.product[0].name + " category: " + response.product[0].categoryName);
		} else {
    		console.log("GTIN " + gtin + " not found in database");
		}
	} else {
    	console.log('Server error: ' + resp.statusCode); 
	}
});

const isbn = "1119578884";
gtinLookup.isbnLookup(isbn, function(response){
	if (!response.serverError) {
		console.log("isbnLookup()");
		if (response.product != undefined) {
    		console.log("ISBN " + isbn + " is " + response.product[0].name);
		} else {
    		console.log("ISBN " + isbn + " not found in database");
		}
  	} else {
    	console.log('Server error: ' + resp.statusCode); 
  	}
});

// search for product name, prefer English (1)
let name = "Bananaboat";
gtinLookup.gtinSearch(name, 1, function(response){
	if (!response.serverError) {
		console.log("gtinSearch()");
		if (response.product.productlist != undefined) {
			for (let i = 0; i < response.product.productlist.length; i++) {
				console.log(response.product.productlist[i].ean + " is " + response.product.productlist[i].name);
			}
		} else {
    		console.log("Name " + name + " not found in database");
		}
  	} else {
    	console.log('Server error: ' + resp.statusCode); 
  	}
});

// search for name, but restrict to Fashion category (20), prefer English (1)
gtinLookup.gtinCategorySearch(name, 20, 1, function(response){
	if (!response.serverError) {
		console.log("gtinCategorySearch()");
		if (response.product.productlist != undefined) {
			for (let i = 0; i < response.product.productlist.length; i++) {
				console.log("Fashion: " + response.product.productlist[i].ean + " is " + response.product.productlist[i].name);
			}
		} else {
    		console.log("Name " + name + " not found in database");
		}
  	} else {
    	console.log('Server error: ' + resp.statusCode); 
  	}
});

// find all GTINs starting with "5099750442", prefer English (1), just fetch page 0
gtinLookup.gtinPrefixSearch("5099750442", 1, 0, function(response){
	if (!response.serverError) {
		console.log("gtinPrefixSearch()");
		if (response.product.productlist != undefined) {
			for (let i = 0; i < response.product.productlist.length; i++) {
				console.log(response.product.productlist[i].ean + " is " + response.product.productlist[i].name);
			}
		} else {
    		console.log("Name " + name + " not found in database");
		}
  	} else {
    	console.log('Server error: ' + resp.statusCode); 
  	}
});

gtinLookup.gtinIssuingCountryLookup(gtin, function(response){
	if (!response.serverError) {
		console.log("gtinIssuingCountryLookup()");
    	console.log("GTIN " + gtin + " was issued in " + response.product[0].issuingCountry);
	} else {
    	console.log('Server error: ' + resp.statusCode); 
	}
});

gtinLookup.gtinVerifyChecksum(gtin, function(response){
	if (!response.serverError) {
		console.log("gtinVerifyChecksum()");
    	console.log("Checksum of GTIN " + gtin + " is " + (response.product[0].valid ? "OK" : "Invalid"));
	} else {
    	console.log('Server error: ' + resp.statusCode); 
	}
});

gtinLookup.gtinBarcodeImage(gtin, function(response){
	if (!response.serverError) {
		console.log("gtinBarcode()");
    	console.log("Base64 encoded PNG image of GTIN " + gtin + " barcode: " + response.product[0].barcode);
	} else {
    	console.log('Server error: ' + resp.statusCode); 
	}
});
