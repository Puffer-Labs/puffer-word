const worker = require("./documentWorker");

const searchDocuments = async (query, res) => {
  try {
    let results = await worker.search(query);
    return results.hits.hits.map((hit) => {
      return {
        docid: hit._id,
        name: hit._source.title,
        snippet:
          hit.highlight.content !== undefined
            ? hit.highlight.content[0]
            : hit.highlight.title[0],
      };
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
      message: "Error while searching documents",
    });
    return;
  }
};

const suggest = async (query, res) => {
  try {
    let results = await worker.suggest(query);
    // Go through all the hits and return anything thats between <em> tags
    return results.hits.hits
      .flatMap((hit) => {
        return hit.highlight.content[0]
          .match(/<em>(.*?)<\/em>/g)
          .map((val) => val.replace(/<em>|<\/em>/g, ""));
      })
      .filter((hit) => hit !== query);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
      message: "Error while searching documents",
    });
  }
};

module.exports = {
  searchDocuments,
  suggest,
};
