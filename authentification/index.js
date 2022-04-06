const express = require('express');
const app = express();
const port = 8080;
require('./config/mongoConfig');

app.get('/', (req, res) => {
	res.send({ msg: 'Hello world' });
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
