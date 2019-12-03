const axios = require('axios');
const cheerio = require('cheerio');
const delay = require('delay');

const SCRAPE_FREQ_SECS = 1;
const SCRAPE_FREQ = SCRAPE_FREQ_SECS * 1000;

const QUOTE = process.argv.slice(2)[0];
if(!QUOTE) {
    console.error('node scraper.js {quote}');
    console.error('Seems like you forgot to pass a quote!');
    return;
}
const URL = `https://ca.finance.yahoo.com/quote/${QUOTE}?p=${QUOTE}`;



var getPriceMovement = async function() {
    let response = await axios(URL);
    const html = response.data;
    const $ = cheerio.load(html);
    let infoDiv = $('#quote-header-info').children('div')[2];
    let price = infoDiv.firstChild.firstChild.firstChild.data;
    let movement = infoDiv.firstChild.children[1].firstChild.firstChild.data;
    return [price, movement];
}

var execScraping = async function() {
    let info = await getPriceMovement();
    console.log(info[0], info[1]);
    await delay(SCRAPE_FREQ);
}

main = async function() {
    // try once
    try {
        await execScraping();
    }
    catch (e) {
        console.error(`${QUOTE} is not valid. Please enter a valid quote.`)
        return;
    }
    while(true) {
        await execScraping();
    }
}

main();