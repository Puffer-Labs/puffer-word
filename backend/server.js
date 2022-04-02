const app = require("express")();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/stream", (req, res) => {
	res.setHeader('Content-Type', 'text/event-stream');
	send(res);
});

let i = 0;
function send (res) {
	res.write('data: ' + i + '\n\n');
	i++;
	setTimeout(() => send(res), 1000);
}

app.listen(8080);
console.log("Listening on 8080");
