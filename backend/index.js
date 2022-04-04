const express = require('express');
const cors = require('cors');
const api = express();
const port = 8000;

api.set('view engine', 'ejs'); //dynamically render html
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cors());

const documentController = require('./controller/documentController');
api.use('/', documentController);
api.get('/', (req, res) => {
	res.send('Hello World!');
});

api.listen(port, () => {
	console.log(`API running on port ${port}`);
});

//parser
//retain operations sets pointer at index specified
//insert operations inserts text at index specified, then adjusts the pointer to after it
