const cheerio = require('cheerio');
const request = require('request');

const url = `https://www.societe.com/societe/comite-d-entreprise-de-vente-privee-com-807686837.html`
request (url, function (err, res, body) {

    console.clear();
    const $ = cheerio.load(body);
    //console.log($);
    // console.log($.xml());
    // console.log($.parseHTML());

    // let allEls = $('tbody');

    // let filteredEls = allEls.filter(function (i, el) {
    //     // this === el
    //     return $(this).children().length > 1;
    // });

    // let items = filteredEls.get();

    // items.forEach(e => {
    //     console.log(e.name, e);
    // });

    let table = $('#rensjur');
    let tbody = $(table.children()[0]);
    let data = tbody.children();

    for (let i=0; i < data.length; i++) {
        let row = $(data[i]);
        let rawData = row.children();
        var title = $(rawData[0]).text().trim().toLowerCase();
        var value = $(rawData[1]).text().trim().toLowerCase();
        if (title != 'Téléphone'.toLowerCase() && title != 'n° de tva intracommunautaire'.toLowerCase()) {
            console.log("title\t", title);
            console.log("value\t", value);
        }
    }
});
