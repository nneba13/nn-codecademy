
import mustache from 'mustache';
import jokes from './jokes.json' with { type: 'json' };
import templates from './templates.json' with { type: 'json' };

function chooseJoke ( currentDate )
{
	const results = filterList( jokes, currentDate );
	return results[ getRandomInt( 0, results.length - 1 ) ];
}

function chooseTemplate ( currentDate )
{
	const results = filterList( templates, currentDate );
	return results[ getRandomInt( 0, results.length - 1 ) ].template;
}

function filterList ( list, currentDate = new Date( Date.now() ) )
{
	const currentYear = currentDate.getFullYear();
	const results = list.filter( function ( template )
	{
		const startDate = Date.parse( `${currentYear}-${template.start}` );
		const stopDate = Date.parse( `${currentYear}-${template.stop}T11:59:59.999` );
		return currentDate >= startDate && currentDate <= stopDate;
	} );

	return results;
}

function getRandomInt ( min, max )
{
	const diff = Math.abs( max - min );
	return Math.floor( Math.random() * diff + Math.min( min, max ) );
}

function renderJoke ( template, joke )
{
	const content =
	{
		joke: joke.text,
		source: joke.source
	};

	return mustache.render( template, content );
}

(function ()
{
	const currentDate = new Date( Date.now() );
	// Use the following line to test specific dates.
	// const currentDate = new Date( Date.parse( '2025-11-01' ) );
	console.info( renderJoke( chooseTemplate( currentDate ), chooseJoke( currentDate ) ) );
} )();
