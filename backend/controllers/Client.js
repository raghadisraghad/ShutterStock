import asyncHandler from 'express-async-handler';
import Target from '../models/User.js';

//CRUD
const getAll = asyncHandler(async (req, res) => {
    const target = await Target.find({ role: '1' });
    res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const target = await Target.findById(id);
    if (!target) {
        return res.status(404).send({ error: 'Target Not Found!' });
    }
    res.status(200).json(target);
});

const add = asyncHandler(async (req, res) => {
    const target = new Target(req.body)
    await target.save()
    res.status(200).json({ message: "Operation Success " })
});

const update = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updateData = req.body;
    const target = await Target.findByIdAndUpdate(id, updateData, { new: true });
    if (!target) {
        return res.status(404).send({ error: 'Target Not Found!' });
    }
    const targetCheck = await Target.findById(id, updateData);
    const checkEmail = await Target.find({ email: updateData.email });
    if (checkEmail && updateData.email != targetCheck.email) {
        return res.status(404).send({ error: 'Email ALready In Use' });
    }
    const checkUsername = await Target.find({ username: updateData.username });
    if (checkUsername && updateData.username != targetCheck.username) {
        return res.status(404).send({ error: 'Username ALready In Use' });
    }
    if (req.file) {
        const avatarPath = `/uploads/${target.username}/${req.file.filename}`;
        updateData.avatar = avatarPath;
        target.avatar = avatarPath;
    }
    await target.save();
    res.status(200).json({ message: "Updated Successfully" })
});

const deleteC = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const target = await Target.findByIdAndDelete(id);
    if (!target) {
        res.status(404).json({ message: "Target Doesn't Exist !!!" })
    }
    res.status(200).json({ message: "Target Deleted Successfully" })
});

export {
    getAll,
    getById,
    add,
    update,
    deleteC
};
