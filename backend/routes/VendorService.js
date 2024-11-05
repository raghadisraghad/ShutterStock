const express = require('express');
const router = express.Router();
const Target = require('../models/User');

router.get("/", async (req, res) => {
    try {
        const target = await Target.find({ role: '3' });
        res.status(200).json(target);
    } catch (err) {
        res.status(500).json({
        Error: err.message,
        });
    }
});

router.get("/username/:username", async (req, res) => {
    try {
      const {username} = req.params
      const target = await Target.find({ role: '3', username: username });
      if (!target) {
        return res.status(404).send({ error: 'Target Not Found!' });
      }
      res.status(200).json(target);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});

router.get("/id/:id", async (req, res) => {
    try {
        const {id} = req.params
        const target = await Target.find({ role: '3', _id: id});
        if (!target) {
            return res.status(404).send({ error: 'Target Not Found!' });
        }
        res.status(200).json(target);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

module.exports = router