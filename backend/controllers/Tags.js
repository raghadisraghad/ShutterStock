import asyncHandler from 'express-async-handler';
import Target from '../models/Tag.js';

const getAll = asyncHandler(async (req, res) => {
  const target = await Target.find().populate('category');
  res.status(200).json(target);
});

const getByName = asyncHandler(async (req, res) => {
  const { name } = req.params
  const target = await Target.findOne({ name: name }).populate('category');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findById(id).populate('category');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params

  if (!category) {
    return res.status(404).send({ error: 'Category Not Found!' });
  }
  
  const target = await Target.find({ category : category });

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
  const target = await Target.findByIdAndUpdate(id, req.body, { new: true });
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json({ message: "Updated Successfully" })
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
  deleteC,
  getByCategory
};