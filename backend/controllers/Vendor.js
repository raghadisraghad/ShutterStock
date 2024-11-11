import asyncHandler from 'express-async-handler';
import Target from '../models/User.js';
import bcrypt from 'bcryptjs';


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

    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    target.password = hashedPassword;
    await target.save();
    res.status(200).json({ message: "Updated Successfully", user: target })
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
    add,
    update,
    deleteC
};