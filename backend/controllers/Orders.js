import asyncHandler from 'express-async-handler';
import Target from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

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
});

const getOrdersAnalysis = asyncHandler(async (req, res) => {
  const totalOrders = await Target.countDocuments();

  const completedOrders = await Target.countDocuments({ status: 'completed' });

  const pendingOrders = await Target.countDocuments({ status: 'pending' });

  const cancelledOrders = await Target.countDocuments({ status: 'cancelled' });

  const totalRevenue = await Target.aggregate([
    { $match: { archive: { $ne: true } } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    { $project: { totalRevenue: 1, _id: 0 } }
  ]);

  const averageOrderTotal = await Target.aggregate([
    { $match: { archive: { $ne: true } } },
    { $group: { _id: null, averageTotal: { $avg: "$total" } } },
    { $project: { averageTotal: 1, _id: 0 } }
  ]);

  const ordersByMonth = await Target.aggregate([
    { $group: { _id: { $month: "$dateCreated" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { month: "$_id", count: 1, _id: 0 } }
  ]);

  const revenueByMonth = await Target.aggregate([
    { $group: { _id: { $month: "$dateCreated" }, totalRevenue: { $sum: "$total" } } },
    { $sort: { _id: 1 } },
    { $project: { month: "$_id", totalRevenue: 1, _id: 0 } }
  ]);

  const completedOrdersByMonth = await Target.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: { $month: "$dateCreated" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { month: "$_id", count: 1, _id: 0 } }
  ]);

  const pendingOrdersByMonth = await Target.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: { $month: "$dateCreated" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { month: "$_id", count: 1, _id: 0 } }
  ]);

  const cancelledOrdersByMonth = await Target.aggregate([
    { $match: { status: 'cancelled' } },
    { $group: { _id: { $month: "$dateCreated" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { month: "$_id", count: 1, _id: 0 } }
  ]);

  const topClientsBySpending = await Target.aggregate([
    { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "clientDetails"
      }
    },
    { $unwind: "$clientDetails" },
    { $project: { id: "$_id", username: "$clientDetails.username", totalSpent: 1, _id: 0 } }
  ]);

  res.status(200).json({
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    averageOrderTotal: averageOrderTotal[0]?.averageTotal || 0,
    ordersByMonth,
    revenueByMonth,
    completedOrdersByMonth,
    pendingOrdersByMonth,
    cancelledOrdersByMonth,
    topClientsBySpending,
  });
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
  getOrdersAnalysis,
  add,
  update,
  deleteC,
  archive,
};