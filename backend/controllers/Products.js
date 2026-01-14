import asyncHandler from 'express-async-handler';
import Target from '../models/Product.js';
import Video from '../models/Video.js';
import Audio from '../models/Audio.js';
import Order from '../models/Order.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

const getAllProducts = asyncHandler(async (req, res) => {
  const target = await Target.find().populate('vendor').populate('category').populate('tags');
  res.status(200).json(target);
});

const getProductByVendorId = asyncHandler(async (req, res) => {
  const { vendorId } = req.params
  const target = await Target.find({ vendor: vendorId }).populate('vendor').populate('category').populate('tags');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findById(id).populate('vendor').populate('category').populate('tags');
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
  const category = await Category.findOne({ name: search });
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
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "productDetails" } },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$productDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldProducts = await Target.populate(mostSoldProducts, { path: "_id" });

  const mostSoldVideos = await Order.aggregate([
    { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "videos", localField: "video", foreignField: "_id", as: "videoDetails" } },
    { $unwind: { path: "$videoDetails", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$videoDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldVideos = await Video.populate(mostSoldVideos, { path: "_id" });

  const mostSoldAudios = await Order.aggregate([
    { $unwind: { path: "$audio", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "audios", localField: "audio", foreignField: "_id", as: "audioDetails" } },
    { $unwind: { path: "$audioDetails", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$audioDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldAudios = await Audio.populate(mostSoldAudios, { path: "_id" });

  const mostPopularCategoriesAgg = await Target.aggregate([
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
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$audio", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    { $unwind: { path: "$videoDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "audios",
        localField: "audio",
        foreignField: "_id",
        as: "audioDetails",
      },
    },
    { $unwind: { path: "$audioDetails", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ["$productDetails.vendor", "$videoDetails.vendor", "$audioDetails.vendor"] },
        totalSales: { $sum: "$total" },
      },
    },
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

  const topRevenueGeneratingItemsAgg = await Order.aggregate([
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$audio", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    { $unwind: { path: "$videoDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "audios",
        localField: "audio",
        foreignField: "_id",
        as: "audioDetails",
      },
    },
    { $unwind: { path: "$audioDetails", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ["$productDetails._id", "$videoDetails._id", "$audioDetails._id"] },
        totalRevenue: { $sum: "$total" },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);

  const topRevenueGeneratingItems = await Target.populate(topRevenueGeneratingItemsAgg, {
    path: "_id",
  });

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
    mostSoldVideos: populatedMostSoldVideos,
    mostSoldAudios: populatedMostSoldAudios,
    mostPopularCategories,
    mostUsedTags,
    topVendorsBySales,
    topVendorsByProducts,
    topRevenueGeneratingItems,
    topSpendingCustomers,
  });
});

const getProductsAnalysesId = asyncHandler(async (req, res) => {
  const mostSoldProducts = await Order.aggregate([
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "productDetails" } },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    { $match: { "status": "completed" } },
    { $group: { 
        _id: "$productDetails._id", 
        productData: { $first: "$productDetails" },
        totalProductsSold: { $sum: 1 },
        totalRevenue: { $sum: { $multiply: ["$total", 0.5] } },
        orderTotal: { $sum: "$total" }
      } },
    { $sort: { totalProductsSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldProducts = await Target.populate(mostSoldProducts, { path: "productData" });

  const mostSoldVideos = await Order.aggregate([
    { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "videos", localField: "video", foreignField: "_id", as: "videoDetails" } },
    { $unwind: { path: "$videoDetails", preserveNullAndEmptyArrays: true } },
    { $match: { "status": "completed" } },
    { $group: { 
        _id: "$videoDetails._id", 
        videoData: { $first: "$videoDetails" },
        totalVideosSold: { $sum: 1 },
        totalRevenue: { $sum: { $multiply: ["$total", 0.5] } },
        orderTotal: { $sum: "$total" }
      } },
    { $sort: { totalVideosSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldVideos = await Video.populate(mostSoldVideos, { path: "videoData" });

  const mostSoldAudios = await Order.aggregate([
    { $unwind: { path: "$audio", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "audios", localField: "audio", foreignField: "_id", as: "audioDetails" } },
    { $unwind: { path: "$audioDetails", preserveNullAndEmptyArrays: true } },
    { $match: { "status": "completed" } },
    { $group: { 
        _id: "$audioDetails._id", 
        audioData: { $first: "$audioDetails" },
        totalAudiosSold: { $sum: 1 },
        totalRevenue: { $sum: { $multiply: ["$total", 0.5] } },
        orderTotal: { $sum: "$total" }
      } },
    { $sort: { totalAudiosSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldAudios = await Audio.populate(mostSoldAudios, { path: "audioData" });

  res.status(200).json({
    mostSoldProducts: populatedMostSoldProducts,
    mostSoldVideos: populatedMostSoldVideos,
    mostSoldAudios: populatedMostSoldAudios,
  });
});

const getProductsAnalysesAllUsers = asyncHandler(async (req, res) => {
  const mostSoldProducts = await Order.aggregate([
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "productDetails" } },
    { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
    { $match: { "status": "completed" } },
    { $group: { 
        _id: "$productDetails._id", 
        productData: { $first: "$productDetails" },
        totalProductsSold: { $sum: 1 },
        totalRevenue: { $sum: { $multiply: ["$total", 0.5] } },
        orderTotal: { $sum: "$total" }
      } },
    { $sort: { totalProductsSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldProducts = await Target.populate(mostSoldProducts, { path: "productData" });

  const mostSoldVideos = await Order.aggregate([
    { $unwind: { path: "$video", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "videos", localField: "video", foreignField: "_id", as: "videoDetails" } },
    { $unwind: { path: "$videoDetails", preserveNullAndEmptyArrays: true } },
    { $match: { "status": "completed" } },
    { $group: { 
        _id: "$videoDetails._id", 
        videoData: { $first: "$videoDetails" },
        totalVideosSold: { $sum: 1 },
        totalRevenue: { $sum: { $multiply: ["$total", 0.5] } },
        orderTotal: { $sum: "$total" }
      } },
    { $sort: { totalVideosSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldVideos = await Video.populate(mostSoldVideos, { path: "videoData" });

  const mostSoldAudios = await Order.aggregate([
    { $unwind: { path: "$audio", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "audios", localField: "audio", foreignField: "_id", as: "audioDetails" } },
    { $unwind: { path: "$audioDetails", preserveNullAndEmptyArrays: true } },
    { $match: { "status": "completed" } },
    { $group: { 
        _id: "$audioDetails._id", 
        audioData: { $first: "$audioDetails" },
        totalAudiosSold: { $sum: 1 },
        totalRevenue: { $sum: { $multiply: ["$total", 0.5] } },
        orderTotal: { $sum: "$total" }
      } },
    { $sort: { totalAudiosSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldAudios = await Audio.populate(mostSoldAudios, { path: "audioData" });

  res.status(200).json({
    mostSoldProducts: populatedMostSoldProducts,
    mostSoldVideos: populatedMostSoldVideos,
    mostSoldAudios: populatedMostSoldAudios,
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
  getById,
  getByTag,
  getProductByCategory,
  add,
  update,
  deleteC,
  archive,
  getProductsAnalyses,
  getProductsAnalysesId,
  getProductsAnalysesAllUsers,
};