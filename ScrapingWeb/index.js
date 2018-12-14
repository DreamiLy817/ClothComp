const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { promisify } = require('util');
const schedule = require('node-schedule');


const readFileAsync = promisify(fs.readFile);

function recuperationListeVetement() {
    axios.get('https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/')
        .then((response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);
                let listPull = [];
                let priceDateArray = [];
                let currentDate = Date(Date.now());
                $('#search-result-items .list-tile').each(function (i, elem) {
                    listPull[i] = {
                        id: $(this).find('.product-wrapper').data('product-id'),
                        title: $(this).find('.product-name h3').text().trim(),
                        url: $(this).find('.img-link').attr('href'),
                        image: $(this).find('.img-link img').attr('src'),
                        priceD: priceDateArray[0] = [
                            { prix : $(this).find('.price').text().trim(), currentDate},
                    
                        ]
                    }
                });
                console.log(listPull);
                const listPullTrimmed = listPull.filter(n => n != undefined)
                fs.writeFile('listPull.json',
                    JSON.stringify(listPullTrimmed, null, 4),
                    (err) => console.log('File successfully written!'))
            }
        }, (error) => console.log(err));
}

async function updateListeVetement() {
    const response = await axios.get('https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/').catch(error => console.log(err));
    if (response.status !== 200) return;
    
    const html = response.data;
    const $ = cheerio.load(html);
    let listPullUpdate = [];
    let priceDateArray = [];
    let currentDate = Date(Date.now());
    $('#search-result-items .list-tile').each(function (i, elem) {
        listPullUpdate[i] = {
            id: $(this).find('.product-wrapper').data('product-id'),
            title: $(this).find('.product-name h3').text().trim(),
            url: $(this).find('.img-link').attr('href'),
            image: $(this).find('.img-link img').attr('src'),
            priceD: priceDateArray[0] = [
                {prix : $(this).find('.price').text().trim(), currentDate}
            ]
        }
    });

    const listPullStockeStr = await readFileAsync(__dirname+'/listPull.json', 'utf8').catch(error => console.log(error));
    // transforme la liste en objet
    let listPullStocke = JSON.parse(listPullStockeStr);
    
    // pour chaque pull de la liste à jour...
    listPullUpdate.forEach(function(item) {
        //...on récupère l'id
        // fonction pour rechercher les meme id 
        const byId = el => el.id === item.id;
        const currentItem = listPullStocke.find(byId);
        if(!currentItem) {
            listPullStocke.push(item);
        } else {
            const oldPrice = currentItem.priceD[currentItem.priceD.length - 1 ].prix;
            const newPrice = item.priceD[0].prix;
            if  (oldPrice == newPrice) {
                console.log("meme prix ");
            } else {
                console.log("different");
                currentItem.priceD.push({prix: newPrice, currentDate: new Date()});
            }
        }
    });
    const listPullUpdateTrimmed = listPullStocke.filter(n => n != undefined )
    fs.writeFile('listPullUpdateNewPull.json',
        JSON.stringify(listPullUpdateTrimmed, null, 4),
        (err)=> console.log('File successfully written!'))
}

//recuperationListeVetement();

updateListeVetement();