const { API } = require("./constants");

const handleUpload = (quillInstance) => {
  const uploadedImage = document.createElement("input");
  uploadedImage.setAttribute("type", "file");
  uploadedImage.setAttribute("accept", "image/*");
  uploadedImage.click();

  uploadedImage.onchange = async () => {
    const file = uploadedImage.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${API}/media/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ mediaid }) => {
        const range = quillInstance.getSelection();
        const position = range ? range.index : quillInstance.getLength();
        const ops = [{ insert: { image: `${API}/media/access/${mediaid}` } }];
        if (position) {
          ops.unshift({ retain: position }); // Insert at beginning of list
        }
        quillInstance.updateContents(ops, "user");
      });
  };
};

module.exports = { handleUpload };
