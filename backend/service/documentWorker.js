const cron = require("node-cron");
const client = require("../config/elasticConfig");
const ShareDB = require("../config/sharedbConfig");
const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

class DocWorker {
  constructor() {
    this.docIds = new Set();
  }

  processDocs() {
    if (this.docIds.size > 0) {
      const docId = this.docIds.values().next().value;
      this.docIds.delete(docId);

      const document = ShareDB.sharedb_connection.get("documents", docId);
      document.fetch(() => {
        if (document.type === null) {
          return;
        }
        const parser = new QuillDeltaToHtmlConverter(document.data.ops, {});
        client.index({
          index: "documents",
          document: {
            docId: docId,
            content: parser.convert(),
          },
        });
      });
    }
  }

  start() {
    cron.schedule("*/5 * * * * *", () => {
      this.processDocs();
    });
  }

  addDoc(docId) {
    this.docIds.add(docId);
  }
}

const workerInstance = new DocWorker();
workerInstance.start();

module.exports = workerInstance;
