import asyncHandler from 'express-async-handler';
import Target from '../models/User.js';
import bcrypt from 'bcryptjs';

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
    const { id } = req.params;
    const updateData = req.body;

    const targetCheck = await Target.findById(id);
    if (!targetCheck) {
        return res.status(404).send({ error: 'Target Not Found!' });
    }

    const checkEmail = await Target.findOne({ email: updateData.email });
    if (checkEmail && checkEmail.email !== targetCheck.email) {
        return res.status(400).send({ error: 'Email Already In Use' });
    }

    const checkUsername = await Target.findOne({ username: updateData.username });
    if (checkUsername && checkUsername.username !== targetCheck.username) {
        return res.status(400).send({ error: 'Username Already In Use' });
    }

    if (updateData.currentPassword != null) {
        const isPasswordValid = await bcrypt.compare(updateData.currentPassword, targetCheck.password);
        if (isPasswordValid)
            updateData.password = await bcrypt.hash(updateData.password, 10);
        else
            return res.status(400).send({ error: 'Current Password Invalid!' });
    } else {
        updateData.password = targetCheck.password;
    }

    const target = await Target.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Updated Successfully", user: target });
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
