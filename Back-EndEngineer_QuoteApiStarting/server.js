const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

function getQuote (req, res, next) {
	const quote = req.query.quote;
	if (!quote) {
		const er = Error('Quote is undefined.');
		er.status = 400;
		next(er);
		return;
	}
	const person = req.query.person;
	if (!person) {
		const er = Error('Person is undefined.');
		er.status = 400;
		next(er);
		return;
	}

	next();
}

app.use(express.static('public'));

app.get('/api/quotes/random', (req, res) => {
	const quote = getRandomElement(quotes);
	res.send({ quote });
});

app.get('/api/quotes', (req, res) => {
	const person = req.query.person;

	let quoteList;
	if (person) {
		quoteList = quotes.filter((quote) => (person === quote.person));
	} else {
		quoteList = quotes;
	}

	res.send({ quotes: quoteList });
});

app.post('/api/quotes', getQuote, (req, res, next) => {
	const quote = req.query.quote;
	const person = req.query.person;
	const data = {
		quote,
		person
	};
	quotes.push(data);

	res.status(202).send({ quote: data });
	next();
});

app.use((er, req, res, next) => {
	console.error(er);
	if (!er.status) {
		er.status = 500;
	}

	res.status(er.status).send(er.message);
});

app.listen(PORT, function () {
	console.info(`Server is listening at http://localhost:${PORT}.`);
});
