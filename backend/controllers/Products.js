import asyncHandler from 'express-async-handler';
import Target from '../models/Product.js';
import Order from '../models/Order.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

const getAllProducts = asyncHandler(async (req, res) => {
  const target = await Target.find({ type: 'product' }).populate('vendor').populate('category');
  res.status(200).json(target);
});

const getProductByVendorId = asyncHandler(async (req, res) => {
  const { vendorId } = req.params
  const target = await Target.find({ type: 'product', vendor: vendorId }).populate('vendor').populate('category').populate('tags');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getServiceByVendorId = asyncHandler(async (req, res) => {
  const { vendorId } = req.params
  const target = await Target.find({ type: 'service', vendor: vendorId }).populate('vendor').populate('category').populate('tags');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getAllServices = asyncHandler(async (req, res) => {
  const target = await Target.find({ type: 'service' }).populate('vendor').populate('category');
  res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findById(id).populate('vendor').populate('category');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getByTag = asyncHandler(async (req, res) => {
  const { search } = req.params
  const tag = await Tag.findOne({ name: search }).populate('category');
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

const getProductsAnalyses = asyncHandler(async (req, res) => {
  const mostSoldProducts = await Order.aggregate([
    { $unwind: "$product" },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $match: { "productDetails.type": "product" } },
    { $group: { _id: "$productDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldProducts = await Target.populate(mostSoldProducts, { path: "_id" });

  const mostPopularCategoriesAgg = await Target.aggregate([
    { $match: { type: "product" } },
    { $group: { _id: "$category", totalProducts: { $sum: 1 } } },
    { $sort: { totalProducts: -1 } },
  ]);

  const mostPopularCategories = await Category.populate(mostPopularCategoriesAgg, {
    path: "_id",
    select: "name",
  });

  const mostUsedTagsAgg = await Target.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", totalTags: { $sum: 1 } } },
    { $sort: { totalTags: -1 } },
    { $limit: 5 },
  ]);

  const mostUsedTags = await Tag.populate(mostUsedTagsAgg, {
    path: "_id",
    select: "name",
  });

  const topVendorsBySalesAgg = await Order.aggregate([
    { $unwind: "$product" },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $group: { _id: "$productDetails.vendor", totalSales: { $sum: "$total" } } },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
  ]);

  const topVendorsBySales = await User.populate(topVendorsBySalesAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  const topVendorsByProductsAgg = await Target.aggregate([
    { $group: { _id: "$vendor", totalProducts: { $sum: 1 } } },
    { $sort: { totalProducts: -1 } },
    { $limit: 5 },
  ]);

  const topVendorsByProducts = await User.populate(topVendorsByProductsAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  const topRevenueGeneratingProductsAgg = await Order.aggregate([
    { $unwind: "$product" },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $group: { _id: "$productDetails._id", totalRevenue: { $sum: "$total" } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);

  const topRevenueGeneratingProducts = await Target.populate(topRevenueGeneratingProductsAgg, { path: "_id" });

  const topSpendingCustomersAgg = await Order.aggregate([
    { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
  ]);

  const topSpendingCustomers = await User.populate(topSpendingCustomersAgg, {
    path: "_id",
    match: { role: "1" },
    select: "username",
  });

  res.status(200).json({
    mostSoldProducts: populatedMostSoldProducts,
    mostPopularCategories,
    mostUsedTags,
    topVendorsBySales,
    topVendorsByProducts,
    topRevenueGeneratingProducts,
    topSpendingCustomers,
  });
});

const getServicesAnalyses = asyncHandler(async (req, res) => {
  const mostSoldServices = await Order.aggregate([
    { $unwind: "$product" },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $match: { "productDetails.type": "service" } },
    { $group: { _id: "$productDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldServices = await Target.populate(mostSoldServices, { path: "_id" });

  const mostPopularServiceCategoriesAgg = await Target.aggregate([
    { $match: { type: "service" } },
    { $group: { _id: "$category", totalServices: { $sum: 1 } } },
    { $sort: { totalServices: -1 } },
  ]);

  const mostPopularServiceCategories = await Category.populate(mostPopularServiceCategoriesAgg, {
    path: "_id",
    select: "name",
  });

  const mostUsedServiceTagsAgg = await Target.aggregate([
    { $unwind: "$tags" },
    { $match: { type: "service" } },
    { $group: { _id: "$tags", totalTags: { $sum: 1 } } },
    { $sort: { totalTags: -1 } },
    { $limit: 5 },
  ]);

  const mostUsedServiceTags = await Tag.populate(mostUsedServiceTagsAgg, {
    path: "_id",
    select: "name",
  });

  const topVendorsByServiceSalesAgg = await Order.aggregate([
    { $unwind: "$product" },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $match: { "productDetails.type": "service" } },
    { $group: { _id: "$productDetails.vendor", totalSales: { $sum: "$total" } } },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
  ]);

  const topVendorsByServiceSales = await User.populate(topVendorsByServiceSalesAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  const topVendorsByServicesAgg = await Target.aggregate([
    { $match: { type: "service" } },
    { $group: { _id: "$vendor", totalServices: { $sum: 1 } } },
    { $sort: { totalServices: -1 } },
    { $limit: 5 },
  ]);

  const topVendorsByServices = await User.populate(topVendorsByServicesAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  const topRevenueGeneratingServicesAgg = await Order.aggregate([
    { $unwind: "$product" },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $match: { "productDetails.type": "service" } },
    { $group: { _id: "$productDetails._id", totalRevenue: { $sum: "$total" } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);

  const topRevenueGeneratingServices = await Target.populate(topRevenueGeneratingServicesAgg, { path: "_id" });

  const topSpendingCustomersOnServicesAgg = await Order.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },
    { $match: { "productDetails.type": "service" } },
    { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
  ]);

  const topSpendingCustomersOnServices = await User.populate(topSpendingCustomersOnServicesAgg, {
    path: "_id",
    match: { role: "1" },
    select: "username",
  });

  res.status(200).json({
    mostSoldServices: populatedMostSoldServices,
    mostPopularServiceCategories,
    mostUsedServiceTags,
    topVendorsByServiceSales,
    topVendorsByServices,
    topRevenueGeneratingServices,
    topSpendingCustomersOnServices,
  });
});


const add = asyncHandler(async (req, res) => {
  try {
    const { productData } = req.body;
    const target = new Target(productData);
    await target.save();
    res.status(200).json({ message: "Operation Success " });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
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
  res.status(200).json({ message: "Target Archived Successfully" })
});

const archive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const target = await Target.findById(id);
  if (!target) {
    res.status(404).json({ message: "Target Doesn't Exist !!!" })
  }
  target.archive = !target.archive;
  await target.save()
  res.status(200).json({ message: "Target Archived Successfully" })
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
  deleteC,
  archive,
  getProductsAnalyses,
  getServicesAnalyses
};