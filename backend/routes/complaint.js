const { uploadToCloudinary } = require("cloudinary");
const { Complaint } = require("../db")
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { createComplaint } = require("../controllers/complaint.controller");

router.post("/",upload.single("image"),createComplaint);

module.exports = router;