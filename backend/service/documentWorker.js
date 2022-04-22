const cron = require("node-cron");
const client = require("../config/elasticConfig");
const ShareDB = require("../config/sharedbConfig");
const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

class DocWorker {
  constructor() {
    this.documentsToBeProcessed = new Set();
  }

  processDocs() {
    if (this.documentsToBeProcessed.size > 0) {
      const docId = this.documentsToBeProcessed.values().next().value;
      this.documentsToBeProcessed.delete(docId);

      const document = ShareDB.sharedb_connection.get("documents", docId);
      document.fetch(async () => {
        const doc = await client.exists({
          index: "documents",
          id: docId,
        });

        if (document.type === null) {
          return;
        }

        const parser = new QuillDeltaToHtmlConverter(document.data.ops, {});
        if (doc) {
          client.update({
            index: "documents",
            id: docId,
            doc: {
              content: parser.convert(),
            },
          });
        } else {
          client.create({
            index: "documents",
            id: docId,
            document: {
              content: parser.convert(),
            },
          });
        }
      });
    }
  }

  /**
   * Runs every 1 minute
   */
  start() {
    cron.schedule("* * * * *", () => {
      this.processDocs();
    });
  }

  add(docId) {
    this.documentsToBeProcessed.add(docId);
  }
}

const workerInstance = new DocWorker();
workerInstance.start();

module.exports = workerInstance;
