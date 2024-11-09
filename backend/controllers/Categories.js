import asyncHandler from 'express-async-handler';
import Target from '../models/Category.js';

const getAll = asyncHandler(async (req, res) => {
  const target = await Target.find();
  res.status(200).json(target);
});

const getByName = asyncHandler(async (req, res) => {
  const { name } = req.params
  const target = await Target.findOne({ name: name });
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findById(id);
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
});

const add = asyncHandler(async (req, res) => {
  const target = new Target(req.body)
  await target.save()
  res.status(200).json({ message: "Operation Success " })
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findByIdAndUpdate(id, req.body, { new: true });
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
});

const deleteC = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findByIdAndDelete(id);
  if (!target) {
    res.status(404).json({ message: "Target Doesn't Exist !!!" })
  }
  res.status(200).json({ message: "Target Deleted Successfully" })
});

export {
  getAll,
  getByName,
  getById,
  add,
  update,
  deleteC
};
