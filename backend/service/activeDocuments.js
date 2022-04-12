class ActiveDocumentPresence {
  constructor() {
    this.activeDocuments = {};
    this.COLLECTION_NAME = "documents";
  }

  addNewConnection(docId, uId) {
    if (this.activeDocuments[docId] && this.activeDocuments[docId][uId]) {
      return false;
    }

    if (this.activeDocuments[docId]) {
      this.activeDocuments[docId] = {};
    }
    return true;
  }

  removeConnection(docId, uId) {
    const presence = this.activeDocuments[docId][uId].getDocPresence(this.COLLECTION_NAME, docId);
    presence.destroy();

    delete this.activeDocuments[docId][uId];

    if (Object.keys(this.activeDocuments[docId]).length === 0) {
      delete this.activeDocuments[docId];
    }
  }

  setupPresence(connectFn, docId, uId, res) {
    const connection = connectFn();
    const doc = connection.getDoc(this.COLLECTION_NAME, docId);
    doc.fetch(() => {
      const presence = connection.getDocPresence(this.COLLECTION_NAME, docId);
      this.activeDocuments[docId][uId] = connection;
      presence.create(uId);

      presence.localPresences[uId].submit({index: 0, length: 0}, (err) => {
        if (err) console.error(err);
        else console.log("Initial presence submission received");
      });

      this.setupRemotePresences(presence, uId, docId);

      this.getCurrentCursorData(presence).forEach((data) => res.write(`data: ${data}\n\n`));

      presence.on("receive", (id, range) => {
        let connClosed = false;
        if (!range) connClosed = true;

        console.log("Range at `receive`", range);
        res.write(`data: ${JSON.stringify({
          cursor: {
            connClosed,
            id: id,
            range: range,
          },
        })}\n\n`);
      }
      );
    });
  }

  setupRemotePresences(presence, uId, docId) {
    const activeDoc = this.activeDocuments[docId];
    for (const clientId in activeDoc) {
      if (clientId !== uId) {
        const remotePresence = activeDoc[docId][clientId].getDocPresence(this.COLLECTION_NAME, docId);
        presence.remotePresences[clientId] = remotePresence.localPresences[clientId].value;
      }
    }
  }

  getCurrentCursorData(presence) {
    const data = [];
    Object.keys(presence.remotePresences).forEach((key) => {
      if (presence.remotePresences[key]) {
        data.push({
          cursor: {
            connClosed: false,
            id: key,
            range: presence.remotePresences[key].value,
          }
        })
      }
    });
    return data;
  }
}

module.exports = ActiveDocumentPresence;