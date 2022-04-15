const MEDIA_URL = "http://LOCALHOST:8000/media";

const handleUpload = (quillInstance) => {
  const uploadedImage = document.createElement("input");
  uploadedImage.setAttribute("type", "file");
  uploadedImage.setAttribute("accept", "image/*");
  uploadedImage.click();

  uploadedImage.onchange = async () => {
    const file = uploadedImage.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${MEDIA_URL}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mediaid }) => {
        const range = quillInstance.getSelection();
        const position = range ? range.index : quillInstance.getLength();
        const ops = [{ insert: { image: `${MEDIA_URL}/access/${mediaid}` } }];
        if (position) {
          ops.unshift({ retain: position }); // Insert at beginning of list
        }
        quillInstance.updateContents(ops, "user");
      });
  };
};

module.exports = { handleUpload };
