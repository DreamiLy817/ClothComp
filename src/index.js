const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { promisify } = require('util');
// const schedule = require('node-schedule'); // Pas utilisé

// Helpers function
const readFileAsync = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const logError = err => console.log(err);

// Utils functions
const currentDate = Date(Date.now());
const getProductInfos = el => ({
	id: el.find('.product-wrapper').data('product-id'),
	title: el.find('.product-name h3').text().trim(),
	url: el.find('.img-link').attr('href'),
	image: el.find('.img-link img').attr('src'),
	priceD: [
		[
			{ prix: el.find('.price').text().trim(), currentDate }
		]
	]
});

async function ListeVetement () {
	const response = await axios.get('https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/').catch(logError);
	if (response.status !== 200) return;

	const listPullStockeStr = await readFileAsync(__dirname + '/listPull.json', 'utf8').catch(logError);

	const $ = cheerio.load(response.data);
	const listFromRequest = $('#search-result-items .list-tile').map((i, elem) => getProductInfos($(elem))).get().filter(n => n);

	// si le fichier de pull stocké est vide, il récupère tout ce qu'il y a sur la page
	if (!listPullStockeStr)
		return writeFile('listPull.json', JSON.stringify(listFromRequest, null, 4))
			.then(() => console.log('La liste de pull de base a été enregistrée'));

	// transforme la liste en objet
	const listPullStocke = JSON.parse(listPullStockeStr);

	// pour chaque pull de la liste à jour...
	listFromRequest.forEach(item => {
		const byId = el => el.id === item.id; // fonction pour trouver un produit via son ID
		const currentItem = listPullStocke.find(byId);
		if (!currentItem) {
			listPullStocke.push(item);
			return true;
		} 

		const oldPrice = currentItem.priceD[currentItem.priceD.length - 1].prix;
		const newPrice = item.priceD[0].prix;
		// si le prix du pull stocké est différent du nouveau prix récupérer on met à jour l'objet 
		if (oldPrice != newPrice)
			currentItem.priceD.push({ prix: newPrice, currentDate: new Date() });
	});
	
	const listPullUpdateTrimmed = listPullStocke.filter(n => n)
	writeFile('listPull.json', JSON.stringify(listPullUpdateTrimmed, null, 4))
		.then(() => console.log('La mise a jour de la liste a bien été effectuée'));
}

ListeVetement();