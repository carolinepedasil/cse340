const express = require('express');
const path = require('path');
const router = express.Router();

const publicDir = path.join(__dirname, "..", "public")
router.use(express.static(publicDir))

module.exports = router;
