<<<<<<< HEAD
const MEDIA_URL = "http://localhost:8000/media";
=======
const MEDIA_URL = "http://10.1.239.193:8000/media";
>>>>>>> 3227011a9c2d34375c65b9adbb1a6e6f5cf2a5b8

const handleUpload = (quillInstance) => {
  const uploadedImage = document.createElement("input");
  uploadedImage.setAttribute("type", "file");
  uploadedImage.setAttribute("accept", "image/*");
  uploadedImage.click();

  uploadedImage.onchange = async () => {
    const file = uploadedImage.files[0];
    const formData = new FormData();
    formData.append("image", file);

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
