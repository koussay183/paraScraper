const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// Define a route to search for a specific ID in the CSV file and fetch APIs
app.get('/product/:name', async (req, res) => {
  const { name } = req.params;
  let rowData;

  // Replace 'yourfile.csv' with the path to your CSV file
  fs.createReadStream('products.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (data["Nom*"] === name) { // Assuming 'id' is the column header for IDs in the CSV
        rowData = data;
      }
    })
    .on('end', async () => {
      if (!rowData) {
        return res.status(404).json({ error: 'ID not found' });
      }

      rowData['availableIn'] = [];

      // 1 --------------------------------------------------------------------------------
      try {
        const response1 = await axios.get(`https://www.maparatunisie.tn/wp-content/plugins/ajax-search-for-woocommerce-premium/includes/Engines/TNTSearchMySQL/Endpoints/search.php?s=${encodeURIComponent(rowData["Nom*"])}`);
        const responseData1 = response1.data?.suggestions[0]; // Accessing the parsed JSON data directly
        const $1 = cheerio.load(responseData1?.price);
        if ($1('ins .woocommerce-Price-amount').text().trim()) {
            rowData.availableIn.push({
                url: responseData1?.url,
                website: "https://www.maparatunisie.tn/",
                websiteName: "maparatunisie.tn",
                price: $1('ins .woocommerce-Price-amount').text().trim()
            });
        }
      } catch (error) {
        console.error(`Error fetching data for block 1:`, error.message);
      }

      // 2 -------------------------------------------------------------------------------
      try {
        const response2 = await axios.get(`https://pharma-shop.tn/jolisearch?s=${encodeURIComponent(rowData["Nom*"])}&ajax=true&id_lang=1&maxRows=10`);
        const responseData2 = response2.data?.products;

        function getObjectByPname(array, pname) {
            for (let i = 0; i < array.length; i++) {
                if (array[i].pname === pname) {
                    return array[i];
                }
            }
            return null; // Return null if pname is not found
        }
        const x = getObjectByPname(responseData2, rowData["Nom*"])
        if (x?.price) {
            rowData.availableIn.push({
                website: "https://pharma-shop.tn/",
                websiteName: "pharma-shop.tn",
                price: x?.price,
                url: x?.link,
            });
        }
      } catch (error) {
        console.error(`Error fetching data for block 2:`, error.message);
      }

      // 3 -------------------------------------------------------------------------------
      try {
        const response3 = await axios.post(`https://letriomedical.tn/recherche?s=${encodeURIComponent(rowData["Nom*"])}&resultsPerPage=1`);
        const responseData3 = response3.data;
        if (responseData3?.products[0]?.price) {
            rowData.availableIn.push({
                website: "https://letriomedical.tn/",
                websiteName: "letriomedical.tn",
                price: responseData3?.products[0]?.price,
                url: responseData3?.products[0]?.link,
            });
        }
      } catch (error) {
        console.error(`Error fetching data for block 3:`, error.message);
      }

      // 4 ----------------------------------------------------------------------------------
      try {
        const response4 = await fetch("https://tunisiepara.com/wp-content/plugins/ajax-search-for-woocommerce-premium/includes/Engines/TNTSearchMySQL/Endpoints/search.php?s=" + rowData["Nom*"], {
            "headers": {
                // Headers configuration
            },
            "body": null,
            "method": "GET"
        });
        const data4 = await response4.json()
        const responseData4 = data4?.suggestions[0]; // Accessing the parsed JSON data directly
        const $4 = cheerio.load(responseData4?.price);
        if ($4('ins .woocommerce-Price-amount').text().trim()) {
            rowData.availableIn.push({
                url: responseData4?.url,
                website: "https://tunisiepara.com/",
                websiteName: "tunisiepara.com",
                price: $4('ins .woocommerce-Price-amount').text().trim()
            });
        }
      } catch (error) {
        console.error(`Error fetching data for block 4:`, error.message);
      }

      // 5 -------------------------------------------------------------------------------
      try {
        const response5 = await axios.post(`https://www.parafendri.tn/recherche?s=${encodeURIComponent(rowData["Nom*"])}&resultsPerPage=1`);
        const responseData5 = response5.data;
        if (responseData5?.products[0]?.price) {
            rowData.availableIn.push({
                website: "https://www.parafendri.tn/",
                websiteName: "www.parafendri.tn",
                price: responseData5?.products[0]?.price,
                url: responseData5?.products[0]?.link,
            });
        }
      } catch (error) {
        console.error(`Error fetching data for block 5:`, error.message);
      }

      // 6 -------------------------------------------------------------------------------
      try {
        const response6 = await axios.get(`https://parapharmacie.tn/wp-admin/admin-ajax.php?action=products_live_search&fn=get_ajax_search&terms=${encodeURIComponent(rowData["Nom*"])}`);
        const responseData6 = response6.data[1];

        const $6 = cheerio.load(responseData6?.price);
        if ($6('ins .woocommerce-Price-amount').text().trim()) {
            rowData.availableIn.push({
                website: "https://pharma-shop.tn/",
                websiteName: "pharma-shop.tn",
                price: $6('ins .woocommerce-Price-amount').text().trim(),
                url: responseData6?.url,
            });
        }
      } catch (error) {
        console.error(`Error fetching data for block 6:`, error.message);
      }

      // 7 -------------------------------------------------------------------------------
      try {
        const response7 = await axios.post(`https://www.paralabel.tn/module/leoproductsearch/productsearch?cate=&q=${encodeURIComponent(rowData["Nom*"])}&limit=100&timestamp=1711460045739&ajaxSearch=1&id_lang=2&leoproductsearch_static_token=dfd3fced4350d8bc16e68a764802b15d&leoproductsearch_token=e4dbba6fe4fad0a3124ee42fa512a6f5`);
        const responseData7 = response7.data;
        if (responseData7?.products[0]?.price) {
            rowData.availableIn.push({
                website: "https://www.paralabel.tn/",
                websiteName: "www.paralabel.tn",
                price: responseData7?.products[0]?.price,
                url: responseData7?.products[0]?.link,
            });
        }
      } catch (error) {
        console.error(`Error fetching data for block 7:`, error.message);
      }

      // 8 --------------------------------------------------------------------------------
      try {
        const response8 = await fetch("https://www.parapharmacietunisie.tn/ajax-search", {
            // Fetch configuration
        });

        const $8 = cheerio.load(await response8.text());
        if ($8('ul.list-group li.list-group-item a').first().find('div span').text().trim()) {
            rowData.availableIn.push({website: "https://www.parapharmacietunisie.tn/",
            websiteName: "parapharmacietunisie.tn",
            price: $8('ul.list-group li.list-group-item a').first().find('div span').text().trim(),
            url: $8('ul.list-group li.list-group-item a').first().attr('href'),
        });
      }
      } catch (error) {
      console.error(`Error fetching data for block 8:`, error.message);
      }

      // 9 --------------------------------------------------------------------------------
      try {
      const response9 = await axios.post(`https://para-boutik.tn/module/iqitsearch/searchiqit?s=${rowData["Nom*"]?.substring(0, Math.ceil(rowData["Nom*"]?.length * 0.7))}&resultsPerPage=10&ajax=true`);
      const responseData9 = response9.data;
      if (responseData9?.products[0]?.price) {
        rowData.availableIn.push({
            website: "https://para-boutik.tn/",
            websiteName: "para-boutik.tn",
            price: responseData9?.products[0]?.price,
            url: responseData9?.products[0]?.link,
        });
      }
      } catch (error) {
      console.error(`Error fetching data for block 9:`, error.message);
      }

      // 10 --------------------------------------------------------------------------------
      try {
      const response10 = await axios.get(`https://www.parashop.tn/index.php?route=journal3/search&search=${rowData["Nom*"]}`);
      const responseData10 = response10.data?.response;

      function compareStrings(str1, str2) {
        // Function implementation
      }

      function getObjectByPname10(array, pname) {
        // Function implementation
      }

      const n = getObjectByPname10(responseData10, rowData["Nom*"])
      if (n?.price) {
        rowData.availableIn.push({
            website: "https://www.parashop.tn/",
            websiteName: "parashop.tn",
            price: n?.price,
            url: n?.href,
        });
      }
      } catch (error) {
      console.error(`Error fetching data for block 10:`, error.message);
      }

      // Getting The Lowest ----------------------------------------------------------
      function findLowestPriceProduct(products) {
        if (products.length === 0) {
            return null; // Return null if the array is empty
        }
    
        // Function to normalize prices
        function normalizePrice(priceString) {
            // Remove non-numeric characters except periods and commas
            const numericString = priceString.replace(/[^\d.,]/g, '');
            // Replace commas with periods
            const normalizedString = numericString.replace(',', '.');
            // Parse the float
            return parseFloat(normalizedString);
        }
    
        let lowestPriceProduct = products[0]; // Initialize with the first product
        let lowestPrice = normalizePrice(lowestPriceProduct.price);
    
        for (let i = 1; i < products.length; i++) {
            let currentPrice = normalizePrice(products[i].price);
            if (!isNaN(currentPrice) && currentPrice < lowestPrice) {
                lowestPrice = currentPrice;
                lowestPriceProduct = products[i];
            }
        }
    
        return lowestPriceProduct;
      }
      if(rowData["availableIn"]){
        rowData["best"] = findLowestPriceProduct(rowData["availableIn"]);
        
      }
      
      // --------------------------------------------------------------------------

      res.json(rowData);
    });
});

app.get('/', async (req, res) => {
    
    var row = []
    // Replace 'yourfile.csv' with the path to your CSV file
    fs.createReadStream('products.csv')
      .pipe(csv())
      .on('data', (data) => {
        row.push(data)
      })
      .on('end', async () => {
        
        res.json(row);
      });
  });
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});