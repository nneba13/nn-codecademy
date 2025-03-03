// See https://discuss.codecademy.com/t/find-your-hat-challenge-project-javascript/462380

const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const END_NONE = 0;
const END_SUCCESS = 1;
const END_FAIL = 2;

class Field
{
	constructor (fld)
	{
		if (!Array.isArray(fld) || fld.length < 1) throw Error('field invalid');

		this._originFld = fld;
		this._fld = JSON.parse(JSON.stringify(fld)); // Slow, but simple and effective.
		this._path = [];
		this.moveTo(0, 0);
	}

	back ()
	{
		if (this._path.length > 1)
		{
			const [x, y] = this._path.pop();
			this._fld[y][x] = this._originFld[y][x];
		}
	}

	getPos ()
	{
		return [ ...this._path[ this._path.length - 1 ] ];
	}

	moveTo (x, y)
	{
		if (y < 0 || y >= this._fld.length) return END_FAIL;
		if (x < 0 || x >= this._fld[0].length) return END_FAIL;

		const coord = [x, y];
		const space = this._fld[y][x];
		if (space !== hole)
		{
			this._path.push(coord);
			this._fld[y][x] = pathCharacter;
		} else {
			return END_FAIL;
		}

		if (space === hat) return END_SUCCESS;
		return END_NONE;
	}

	print ()
	{
		return this._fld.map((row) => (row.join(''))).join('\n');
	}

	static generateField (width, height, percentage)
	{
		const grid = [];
		for (let ii = 0; ii < height; ii++)
		{
			grid.push((new Array(width)).fill(fieldCharacter, 0, width));
		}

		let count = Math.round(width * height * percentage);
		while (count > 0)
		{
			const posX = Math.floor(Math.random() * (width - 1));
			const posY = Math.floor(Math.random() * (height - 1));
			if (posX !== 0 && posY !== 0 && grid[posY][posX] !== hole)
			{
				grid[posY][posX] = hole;
			}

			--count;
		}

		count = 1;
		while (count > 0)
		{
			const posX = Math.floor(Math.random() * (width - 1));
			const posY = Math.floor(Math.random() * (height - 1));
			if (grid[posY][posX] !== hole)
			{
				grid[posY][posX] = hat;
			}

			--count;
		}

		return new Field(grid);
	}
}

function createBoard ()
{
	return Field.generateField(16, 16, 0.25);
}

function run ()
{
	let board = createBoard();

	let completion = END_NONE;
	let message = '';
	while (completion === END_NONE)
	{
		console.log(`\n\n${board.print()}\n${message ? (message + '\n') : ''}`);
		const res = prompt(`Move?`, '');
		const [posX, posY] = board.getPos();
		switch (res.toLowerCase())
		{
			// New
			case 'n':
			{
				board = createBoard();
				break;
			}
			// Up
			case 'u':
			{
				completion = board.moveTo(posX, posY - 1);
				break;
			}
			// Down
			case 'd':
			{
				completion = board.moveTo(posX, posY + 1);
				break;
			}
			// Left
			case 'l':
			{
				completion = board.moveTo(posX - 1, posY);
				break;
			}
			// Right
			case 'r':
			{
				completion = board.moveTo(posX + 1, posY);
				break;
			}
			// Backup
			case 'b':
			{
				completion = board.back();
				break;
			}
			// Error
			default:
			{
				message = 'Command unavailable';
				break;
			}
		}
	}

	if (completion === END_SUCCESS)
	{
		console.log(`\n\nYeah!!! You found your hat.`);
	} else {
		console.log(`\n\nGrr!!! You fell down a hole, now you will never find your hat!`);
	}
}

run();
