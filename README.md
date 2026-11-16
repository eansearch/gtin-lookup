# gtin-lookup

A Javascript module to lookup GTIN, EAN or ISBN codes using the API on https://www.ean-search.org

## Install

`npm install gtin-lookup`

## Obtain an API key

To use the module, you need an API access token from
https://www.ean-search.org/ean-database-api.html

## Usage

The example reads the API token from the environment variable `EAN_SEARCH_API_TOKEN`,
so you don't have to put it into your source code.

```javascript

const GTINLookup = require("gtin-lookup");

const apiToken = process.env.EAN_SEARCH_API_TOKEN;
const gtinLookup = new GTINLookup(apiToken);

// helper: true if the API returned a product (and not an error like "Barcode not found")
function found(response) {
  return response.product != undefined && response.product[0] != undefined
    && response.product[0].error == undefined;
}

// helper: true if a search returned at least one product
function foundList(response) {
  return response.product.productlist != undefined && response.product.productlist.length > 0;
}

// lookup GTIN, prefer English (1) name
const gtin = "5099750442227";
gtinLookup.gtinLookup(gtin, 1, function(response) {
  if (!response.serverError) {
    console.log("gtinLookup()");
    if (found(response)) {
      console.log("GTIN " + gtin + " is " + response.product[0].name + " category: " + response.product[0].categoryName
        + " Google category " + response.product[0].googleCategoryId);
    } else {
      console.log("GTIN " + gtin + " not found in database");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// lookup book data using ISBN-10 or ISBN-13
const isbn = "1119578884";
gtinLookup.isbnLookup(isbn, function(response) {
  if (!response.serverError) {
    console.log("isbnLookup()");
    if (found(response)) {
      console.log("ISBN " + isbn + " is " + response.product[0].name);
    } else {
      console.log("ISBN " + isbn + " not found in database");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// search for product name (exact match), prefer English (1)
const name = "Bananaboat";
gtinLookup.gtinSearch(name, 1, function(response) {
  if (!response.serverError) {
    console.log("gtinSearch()");
    if (foundList(response)) {
      for (const product of response.product.productlist) {
        console.log(product.ean + " is " + product.name);
      }
    } else {
      console.log("Name " + name + " not found in database");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// search for product with a similar name
const similarName = "Apple iPhone 16GB robust";
gtinLookup.gtinSimilarSearch(similarName, 1, function(response) {
  if (!response.serverError) {
    console.log("gtinSimilarSearch()");
    if (foundList(response)) {
      for (const product of response.product.productlist) {
        console.log(product.ean + " is " + product.name);
      }
    } else {
      console.log("No product similar to " + similarName + " found in database");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// search for name, but restrict to Fashion category (20), prefer English (1)
gtinLookup.gtinCategorySearch(name, 20, 1, function(response) {
  if (!response.serverError) {
    console.log("gtinCategorySearch()");
    if (foundList(response)) {
      for (const product of response.product.productlist) {
        console.log("Fashion: " + product.ean + " is " + product.name);
      }
    } else {
      console.log("Name " + name + " not found in Fashion category");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// find all GTINs starting with "5099750442", prefer English (1), just fetch page 0
const prefix = "5099750442";
gtinLookup.gtinPrefixSearch(prefix, 1, 0, function(response) {
  if (!response.serverError) {
    console.log("gtinPrefixSearch()");
    if (foundList(response)) {
      for (const product of response.product.productlist) {
        console.log(product.ean + " is " + product.name);
      }
    } else {
      console.log("No GTINs with prefix " + prefix + " found in database");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// find the Amazon ASIN for a GTIN, and the GTIN for an ASIN
gtinLookup.gtinFindAsin("9781119578888", function(response) {
  if (!response.serverError) {
    console.log("gtinFindAsin()");
    if (found(response) && response.product[0].asin != undefined) {
      const asin = response.product[0].asin;
      console.log("ASIN is " + asin);
      gtinLookup.asinFindGtin(asin, function(response) {
        if (!response.serverError) {
          console.log("asinFindGtin()");
          if (found(response) && response.product[0].ean != undefined) {
            console.log("ASIN " + asin + " is GTIN " + response.product[0].ean);
          } else {
            console.log("No GTIN found for ASIN " + asin);
          }
        } else {
          console.log("Server error: " + response.statusCode);
        }
      });
    } else {
      console.log("No ASIN found for this GTIN");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// find the Library of Congress control number (LCCN) for a GTIN, and the GTIN for an LCCN
// (there can be several GTINs for one LCCN, you get the first one found)
gtinLookup.gtinFindLccn("9781119578888", function(response) {
  if (!response.serverError) {
    console.log("gtinFindLccn()");
    if (found(response) && response.product[0].lccn != undefined) {
      const lccn = response.product[0].lccn;
      console.log("LCCN is " + lccn);
      gtinLookup.lccnFindGtin(lccn, function(response) {
        if (!response.serverError) {
          console.log("lccnFindGtin()");
          if (found(response) && response.product[0].ean != undefined) {
            console.log("LCCN " + lccn + " is GTIN " + response.product[0].ean);
          } else {
            console.log("No GTIN found for LCCN " + lccn);
          }
        } else {
          console.log("Server error: " + response.statusCode);
        }
      });
    } else {
      console.log("No LCCN found for this GTIN");
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// lookup the country where a GTIN barcode was registered
gtinLookup.gtinIssuingCountryLookup(gtin, function(response) {
  if (!response.serverError) {
    console.log("gtinIssuingCountryLookup()");
    if (found(response)) {
      console.log("GTIN " + gtin + " was issued in " + response.product[0].issuingCountry);
    } else {
      console.log("Error: " + response.product[0].error);
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// verify the checksum of a GTIN
gtinLookup.gtinVerifyChecksum(gtin, function(response) {
  if (!response.serverError) {
    console.log("gtinVerifyChecksum()");
    if (found(response)) {
      console.log("Checksum of GTIN " + gtin + " is " + (response.product[0].valid ? "OK" : "Invalid"));
    } else {
      console.log("Error: " + response.product[0].error);
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

// generate a PNG barcode image for a GTIN
const width = 200; // PNG width
const height = 100; // PNG height
gtinLookup.gtinBarcodeImage(gtin, width, height, function(response) {
  if (!response.serverError) {
    console.log("gtinBarcodeImage()");
    if (found(response)) {
      console.log("HTML: <img src=\"data:image/png;base64," + response.product[0].barcode + "\">");
    } else {
      console.log("Error: " + response.product[0].error);
    }
  } else {
    console.log("Server error: " + response.statusCode);
  }
});

```
