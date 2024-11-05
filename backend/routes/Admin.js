const express = require('express');
const router = express.Router();
const User = require('../models/User');

//CRUD
router.post('/create', async (req, res) => {
});

router.post('/readAll', async (req, res) => {
});

router.post('/read/:id', async (req, res) => {
});

router.post('/update', async (req, res) => {
});

router.post('/delete/:id', async (req, res) => {
});

//

module.exports = router;