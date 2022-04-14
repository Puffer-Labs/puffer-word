/**
 * Routes for media endpoints
 */

const express = require("express");
const router = express.Router();
const mediaService = require("../service/mediaService");

/**
 * Upload image to the /uploads directory.
 * @returns {string} The media ID of the uploaded image.
 */
router.post(
  "/upload",
  mediaService.upload.single("image"),
  (req, res) => {
    // Save uploaded file and its mime type and return its ID.
    res.json({
      mediaid: req.file.filename.split(".").shift(),
    });
  },
  // (err, req, res, next) => {
  //   res.status(400).send({ error: true, message: err.message });
  // }
);

/**
 * Fetch the image with the given media ID.
 * @returns {string} The image data.
 */
router.get("/access/:mediaid", (req, res) => {
  try {
    mediaService.getFile(res, req.params.mediaid);
  } catch (err) {
    res.status(400).send({ error: true, message: err.message });
  }
});

module.exports = router;
