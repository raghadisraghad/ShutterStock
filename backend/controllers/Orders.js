import asyncHandler from 'express-async-handler';
import Target from '../models/Order.js';
import Product from '../models/Product.js';

const getAll = asyncHandler(async (req, res) => {
  const target = await Target.find().populate('client').populate('product');
  res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findById(id).populate('client').populate('product');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getClientOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.find({ client: id }).populate('client').populate('product');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getVendorOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Product.find({ vendor: id });
    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products found for this vendor.' });
    }

    const productIds = products.map(product => product._id);
    if (!productIds.length) {
      return res.status(404).json({ error: 'No valid product IDs found for this vendor.' });
    }

    const orders = await Target.find({ product: { $in: productIds } });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found containing these products.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving vendor orders:", error);
    res.status(500).json({ error: 'An error occurred while retrieving vendor orders. Please try again later.' });
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

const archive = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findById(id);
  if (!target) {
    res.status(404).json({ message: "Target Doesn't Exist !!!" })
  }
  target.archive = true;
  await target.save()
  res.status(200).json({ message: "Target Archived Successfully" })
});

export {
  getAll,
  getById,
  getClientOrder,
  getVendorOrder,
  add,
  update,
  deleteC,
  archive
};