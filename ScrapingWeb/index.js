let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');
let schedule = require('node-schedule');

axios.get('https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/')
    .then((response) => {
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            let listPull = [];
            $('#search-result-items .list-tile').each(function(i, elem) {
                listPull[i] = {
                  id: $(this).find('.product-wrapper').data('product-id'),
                    title: $(this).find('.product-name h3').text().trim(),
                    url: $(this).find('.img-link').attr('href'),
                    image : $(this).find('.img-link img').attr('src'),
                    prix : $(this).find('.price').text().trim()
                }
            });
            console.log(listPull);
            const listPullTrimmed = listPull.filter(n => n != undefined )
            fs.writeFile('listPull.json',
                          JSON.stringify(listPullTrimmed, null, 4),
                          (err)=> console.log('File successfully written!'))
    }
}, (error) => console.log(err) );
