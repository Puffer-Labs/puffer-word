<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const parser = require("morgan-body");
const api = express();
const port = 8000;

=======
const express = require('express');
const cors = require('cors');
const api = express();
const port = 8000;

api.set('view engine', 'ejs'); //dynamically render html
>>>>>>> 006641460f78980fdb2106b84a252c7d9024b6f9
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use(cors());
parser(api);

const documentController = require('./controller/documentController');
api.use('/', documentController);
api.get('/', (req, res) => {
	res.send('Hello World!');
});

api.listen(port, () => {
	console.log(`API running on port ${port}`);
});

<<<<<<< HEAD
=======
//parser
//retain operations sets pointer at index specified
//insert operations inserts text at index specified, then adjusts the pointer to after it
>>>>>>> 006641460f78980fdb2106b84a252c7d9024b6f9
