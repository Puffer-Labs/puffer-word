const { sharedb_server } = require("../config/sharedbConfig");

/**
 * An active document represents a document that has a presence.
 * So inherently, an active document is linked with a presence.
 * This class provides an interface for dealing with active documents
 * and presences for those documents.
 */
class ActiveDocumentPresence {
  constructor() {
    this.activeDocuments = {};
    this._COLLECTION_NAME = "documents";
  }

  /**
   *
   * @param {string} docId - Document ID
   * @param {string} uId - client ID
   * @returns If the new connection was successfully added to the active documents object,
   *         then return true. Otherwise, return false.
   */
  addNewConnection(docId, uId) {
    //If this document is currently active && a client with this id is already connected, do not accept connection
    if (this.activeDocuments[docId] && this.activeDocuments[docId][uId]) {
      return false;
    }
    //document is not active, create key for it
    if (!this.activeDocuments[docId]) {
      this.activeDocuments[docId] = {};
    }
    return true;
  }

  /**
   *
   * @param {string} docId - Document ID
   * @param {string} uId - client ID
   *
   * Deletes a connection from an active document. If there are no connections left,
   * then the active document is deleted.
   */
  removeConnection(docId, uId) {
    const presence = this.activeDocuments[docId][uId].getDocPresence(
      this._COLLECTION_NAME,
      docId
    );
    presence.destroy();

    delete this.activeDocuments[docId][uId];

    if (Object.keys(this.activeDocuments[docId]).length === 0) {
      delete this.activeDocuments[docId];
    }
  }

  /**
   *
   * @param {string} docId - Document ID
   * @param {string} uId - client ID
   * @param {Response} res - Response object
   *
   * Initalizes an initial presence when a new user connects to the document.
   */
  setupPresence(docId, uId, res) {
    const connection = sharedb_server.connect();
    const doc = connection.get(this._COLLECTION_NAME, docId);
    doc.fetch(() => {
      const presence = connection.getDocPresence(this._COLLECTION_NAME, docId);
      this.activeDocuments[docId][uId] = connection;

      presence.subscribe(function (err) {
        if (err) {
          console.log(err);
        }
      });

      presence.create(uId);

      // Submit an initial cursor position
      presence.localPresences[uId].submit({ index: 0, length: 0 }, (err) => {
        if (err) console.error(err);
        else console.log("Initial presence submission received");
      });

      this.setupRemotePresences(presence, uId, docId);

      // Send initial cursor position to all other users of the document.
      this.getCurrentCursorData(presence).forEach((data) =>
        res.write(`data: ${JSON.stringify(data)}\n\n`)
      );

      presence.on("receive", (id, range) => {
        let cursor = null;
        if (range)
          cursor = {
            index: range.index,
            name: id,
            length: range.length,
          };

        console.log(`Range received: ${JSON.stringify(range)} for ${id}`);
        res.write(
          `data: ${JSON.stringify({
            id: id,
            cursor: cursor,
          })}\n\n`
        );
      });
    });
  }

  /**
   *
   * @param {string} presence - Presence object
   * @param {string} uId - client ID
   * @param {string} docId - document ID
   *
   * When a client connects to a document with already connected users, this newly connected
   * client doesn't yet have the presence data of the other users. This function manually adds
   * all remote presences of the document to the newly connected client.
   */
  setupRemotePresences(presence, uId, docId) {
    const activeDoc = this.activeDocuments[docId];
    for (const clientId in activeDoc) {
      if (clientId !== uId) {
        const remotePresence = activeDoc[clientId].getDocPresence(
          this._COLLECTION_NAME,
          docId
        );
        presence.remotePresences[clientId] =
          remotePresence.localPresences[clientId].value;
      }
    }
  }

  /**
   *
   * @param {*} presence - Presence object
   * @returns List of cursor data
   *
   * Gets the current cursor data for all users of the document.
   */
  getCurrentCursorData(presence) {
    const data = [];
    Object.keys(presence.remotePresences).forEach((key) => {
      if (presence.remotePresences[key]) {
        data.push({
          id: key,
          cursor: {
            name: key,
            index: presence.remotePresences[key].index,
            length: presence.remotePresences[key].length,
          },
        });
      }
    });
    return data;
  }

  /**
   *
   * @param {string} docId - document ID
   * @param {string} uId - client ID
   * @param {Range} range - Range object
   * Updates the cursor position for the client.
   */
  submitPresenceRange = (docId, uId, range) => {
    const connection = this.activeDocuments[docId][uId];
    const doc = connection.get(this._COLLECTION_NAME, docId);
    doc.fetch(() => {
      const presence = connection.getDocPresence(this._COLLECTION_NAME, docId);
      /**
       * A presence has a Set of local presences. Each local presence is
       * identified by a unique ID, which is the client's ID.
       * Here, we get the local presence for the client and then update its range.
       * This will then notify all other clients of this client's new cursor position.
       */
      console.log("Range before callback", range);
      presence.localPresences[uId].submit(range, (err) => {
        if (err) console.error(err);
        else console.log("Range at `submit`", range);
      });
    });
  };
}

module.exports = ActiveDocumentPresence;
