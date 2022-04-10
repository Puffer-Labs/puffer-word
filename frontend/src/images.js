const handleUpload = (quillInstance) => {
  const uploadedImage = document.createElement("input");
  uploadedImage.setAttribute("type", "file");
  uploadedImage.setAttribute("accept", "image/*");
  uploadedImage.click();

  uploadedImage.onchange = async () => {
    const file = uploadedImage.files[0];
    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ url }) => {
        const range = quillInstance.getSelection();
        const position = range ? range.index : quillInstance.getLength();
        const ops = [{ insert: { image: url } }];
        if (position) {
          ops.unshift({ retain: position }); // Insert at beginning of list
        }
        quillInstance.updateContents(ops, "user");
      });
  };
};

module.exports = { handleUpload };
