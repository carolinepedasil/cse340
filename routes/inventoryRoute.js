const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');

router.get('/', invController.buildManagementView);

router.get('/add-classification', invController.buildAddClassificationView);
router.post('/add-classification', invController.addClassification);

router.get('/type/:classification', invController.buildByClassification);

module.exports = router;
