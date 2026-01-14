import asyncHandler from 'express-async-handler';
import Target from '../models/User.js';

const getAll = asyncHandler(async (req, res) => {
    try {
        const target = await Target.find({ role: '3' });
        res.status(200).json(target);
    } catch (err) {
        res.status(500).json({
            Error: err.message,
        });
    }
});

const getByUsername = asyncHandler(async (req, res) => {
    try {
        const { username } = req.params
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

const getById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const target = await Target.find({ role: '3', _id: id });
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

export {
    getAll,
    getByUsername,
    getById
};