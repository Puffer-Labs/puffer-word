const multer = require("multer");
const fs = require("fs");

/**
 * Set up multer so images are saved to the
 * /uploads directory under a random media ID.
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${_generateRandomID()}.${file.originalname.split(".").pop()}`);
  },
});

/**
 * Limit the file size to 10MB and only allow .jpeg and .png files.
 */
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

/**
 *
 * @returns {string} A random string of length 22.
 */
const _generateRandomID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * 
 * @param {Response} res - The response object.
 * @param {string} mediaId - The media ID.
 */
const getFile = (res, mediaId) => {
	/**
	 * Read the file from the /uploads directory.
	 * The slice removes the /controller/ part of the path.
	 */
  const uploadPath =
    __dirname.split("/").slice(0, -1).join("/") +
    "/uploads/" +
		mediaId

  // Check if the file exists.
  if (fs.existsSync(uploadPath + ".jpeg")) {
    res.sendFile(`${uploadPath}.jpeg`);
  } else if (fs.existsSync(uploadPath + ".png")) {
    res.sendFile(`${uploadPath}.png`);
  } else {
    res.status(404).send({ error: "File not found!" });
  }
};

module.exports = {
	upload,
	getFile,
};
