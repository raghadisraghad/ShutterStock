import asyncHandler from 'express-async-handler';
import Target from '../models/Product.js';
import Tag from '../models/Tag.js';
import Category from '../models/Category.js';

const getAllProducts = asyncHandler(async (req, res) => {
  const target = await Target.find({ type: 'product' }).populate('category');
  res.status(200).json(target);
});

const getProductByVendorId = asyncHandler(async (req, res) => {
  const { vendorId } = req.params
  const target = await Target.find({ type: 'product', vendor: vendorId });
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getServiceByVendorId = asyncHandler(async (req, res) => {
  const { vendorId } = req.params
  const target = await Target.find({ type: 'service', vendor: vendorId });
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getAllServices = asyncHandler(async (req, res) => {
  const target = await Target.find({ type: 'service' });
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

const getByTag = asyncHandler(async (req, res) => {
  const { search } = req.params
  const tag = await Tag.findOne({ name: search });
  if (!tag) {
    return res.status(404).send({ error: 'Tag Not Found!' });
  }
  const target = await Target.find({ tag: tag._id });
  if (target.length === 0) {
    return res.status(404).json({ message: 'No products found for this tag' });
  }
  res.status(200).json(target);
});

const getProductByCategory = asyncHandler(async (req, res) => {
  const { search } = req.params
  const category = await Category.findOne({ type: 'product', name: search });
  if (!category) {
    return res.status(404).send({ error: 'Category Not Found!' });
  }
  const target = await Target.find({ category: category._id });
  if (target.length === 0) {
    return res.status(404).json({ message: 'No products found for this category' });
  }
  res.status(200).json(target);
});

const getServiceByCategory = asyncHandler(async (req, res) => {
  const { search } = req.params
  const category = await Category.findOne({ type: 'service', name: search });
  if (!category) {
    return res.status(404).send({ error: 'Category Not Found!' });
  }
  const target = await Target.find({ category: category._id });
  if (target.length === 0) {
    return res.status(404).json({ message: 'No products found for this category' });
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
  getAllProducts,
  getProductByVendorId,
  getServiceByVendorId,
  getAllServices,
  getById,
  getByTag,
  getProductByCategory,
  getServiceByCategory,
  add,
  update,
  deleteC
};