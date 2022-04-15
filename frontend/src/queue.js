const API = "http://localhost:8080";

/**
 * This is a running queue of all changes that need 
 * to be sent to the server.
 */
class Queue {
	constructor(docId, uId) {
		this.queue = [];
		this.version = 0; // Current document version
		this.docId = docId;
		this.uId = uId;
	}

	enqueue(op) {
		this.queue.push(op);
	}

	dequeue() {
		return this.queue.shift();
	}

	incrementVersion()  {
		this.version += 1;
	}

	setVersion(version) {
		this.version = version;
	}

	/**
	 * This recursive function will send the head of the queue to the server
	 * and then wait 25 ms before sending the next operation.
	 */
	process() {
		const op = this.dequeue();
		if (op) {
			fetch(`${API}/doc/op/${this.docId}/${this.uId}`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ op, version: this.version }),
			}).then((res) => {
				return res.json();
			}).then((body) => {
				if (body.status === "ok") {
					console.log("Successfully sent op");
				}
			});
		}
		setTimeout(() => this.process(), 25);
	}
}

module.exports = Queue;