# gtin-lookup

A Javascript module to lookup GTIN, EAN or ISBN codes using the API on https://www.ean-search.org

## Install

`npm install gtin-lookup`

## Obtain an API key

To use the module, you need an API access token from
https://www.ean-search.org/ean-database-api.html

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
        console.log("GTIN " + gtin + " is " + response.product[0].name + " category: " + response.product[0].categoryName
		+ " Google category " + response.product[0].googleCategoryId);
    } else {
        console.log("GTIN " + gtin + " not found in database");
    }
  } else {
      console.log('Server error: ' + resp.statusCode); 
  }
});

// lookup book data using ISBN-10 or ISBN-13
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

// search for product name (exact match), prefer English (1)
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

// search for product with a similar name
gtinLookup.gtinSimilarSearch("Apple iPhone 16GB robust", 1, function(response){
  if (!response.serverError) {
    console.log("gtinSimilarSearch()");
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

// find the Amazon ASIN for a GTIN, and the GTIN for an ASIN
gtinLookup.gtinFindAsin("9781119578888", function(response){
  if (!response.serverError) {
    console.log("gtinFindAsin()");
    if (response.product[0].asin != undefined) {
      const asin = response.product[0].asin;
      console.log("ASIN is " + asin);
      gtinLookup.asinFindGtin(asin, function(response){
        if (!response.serverError && response.product[0].ean != undefined) {
          console.log("asinFindGtin()");
          console.log("ASIN " + asin + " is GTIN " + response.product[0].ean);
        }
      });
    } else {
        console.log("No ASIN found for this GTIN");
    }
  } else {
      console.log('Server error: ' + response.statusCode);
  }
});

// find the Library of Congress control number (LCCN) for a GTIN, and the GTIN for an LCCN
// (there can be several GTINs for one LCCN, you get the first one found)
gtinLookup.gtinFindLccn("9781119578888", function(response){
  if (!response.serverError) {
    console.log("gtinFindLccn()");
    if (response.product[0].lccn != undefined) {
      const lccn = response.product[0].lccn;
      console.log("LCCN is " + lccn);
      gtinLookup.lccnFindGtin(lccn, function(response){
        if (!response.serverError && response.product[0].ean != undefined) {
          console.log("lccnFindGtin()");
          console.log("LCCN " + lccn + " is GTIN " + response.product[0].ean);
        }
      });
    } else {
        console.log("No LCCN found for this GTIN");
    }
  } else {
      console.log('Server error: ' + response.statusCode);
  }
});

// lookup the country where a GTIN barcode was registered
gtinLookup.gtinIssuingCountryLookup(gtin, function(response){
  if (!response.serverError) {
    console.log("gtinIssuingCountryLookup()");
      console.log("GTIN " + gtin + " was issued in " + response.product[0].issuingCountry);
  } else {
      console.log('Server error: ' + resp.statusCode); 
  }
});

// verify the checksum of a GTIN
gtinLookup.gtinVerifyChecksum(gtin, function(response){
  if (!response.serverError) {
    console.log("gtinVerifyChecksum()");
      console.log("Checksum of GTIN " + gtin + " is " + (response.product[0].valid ? "OK" : "Invalid"));
  } else {
      console.log('Server error: ' + resp.statusCode); 
  }
});

// generate a PNG barcode image for a GTIN
var width = 200; // PNG width
var height = 100; // PNG height
gtinLookup.gtinBarcodeImage(gtin, width, height, function(response){
  if (!response.serverError) {
    console.log("gtinBarcode()");
    console.log("HTML: <img src=\"data:image/png;base64," + response.product[0].barcode + "\">");
  }
});

