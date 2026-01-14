import asyncHandler from 'express-async-handler';
import Target from '../models/Video.js';
import Order from '../models/Order.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

const getAllVideos = asyncHandler(async (req, res) => {
  const target = await Target.find().populate('vendor').populate('category').populate('tags');
  res.status(200).json(target);
});

const getVideoByVendorId = asyncHandler(async (req, res) => {
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
    return res.status(404).json({ message: 'No Videos found for this tag' });
  }
  res.status(200).json(target);
});

const getVideoByCategory = asyncHandler(async (req, res) => {
  const { search } = req.params
  const category = await Category.findOne({ name: search });
  if (!category) {
    return res.status(404).send({ error: 'Category Not Found!' });
  }
  const target = await Target.find({ category: category._id });
  if (target.length === 0) {
    return res.status(404).json({ message: 'No Videos found for this category' });
  }
  res.status(200).json(target);
});

const getVideosAnalyses = asyncHandler(async (req, res) => {
  const mostSoldVideos = await Order.aggregate([
    { $unwind: "$Video" },
    {
      $lookup: {
        from: "Videos",
        localField: "Video",
        foreignField: "_id",
        as: "VideoDetails",
      },
    },
    { $unwind: "$VideoDetails" },
    { $group: { _id: "$VideoDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  const populatedMostSoldVideos = await Target.populate(mostSoldVideos, { path: "_id" });

  const mostPopularCategoriesAgg = await Target.aggregate([
    { $group: { _id: "$category", totalVideos: { $sum: 1 } } },
    { $sort: { totalVideos: -1 } },
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
    { $unwind: "$Video" },
    {
      $lookup: {
        from: "Videos",
        localField: "Video",
        foreignField: "_id",
        as: "VideoDetails",
      },
    },
    { $unwind: "$VideoDetails" },
    { $group: { _id: "$VideoDetails.vendor", totalSales: { $sum: "$total" } } },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
  ]);

  const topVendorsBySales = await User.populate(topVendorsBySalesAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  const topVendorsByVideosAgg = await Target.aggregate([
    { $group: { _id: "$vendor", totalVideos: { $sum: 1 } } },
    { $sort: { totalVideos: -1 } },
    { $limit: 5 },
  ]);

  const topVendorsByVideos = await User.populate(topVendorsByVideosAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  const topRevenueGeneratingVideosAgg = await Order.aggregate([
    { $unwind: "$Video" },
    {
      $lookup: {
        from: "Videos",
        localField: "Video",
        foreignField: "_id",
        as: "VideoDetails",
      },
    },
    { $unwind: "$VideoDetails" },
    { $group: { _id: "$VideoDetails._id", totalRevenue: { $sum: "$total" } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);

  const topRevenueGeneratingVideos = await Target.populate(topRevenueGeneratingVideosAgg, { path: "_id" });

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
    mostSoldVideos: populatedMostSoldVideos,
    mostPopularCategories,
    mostUsedTags,
    topVendorsBySales,
    topVendorsByVideos,
    topRevenueGeneratingVideos,
    topSpendingCustomers,
  });
});

const add = asyncHandler(async (req, res) => {
  try {
    const { VideoData } = req.body;
    const target = new Target(VideoData);
    await target.save();
    res.status(200).json({ message: "Operation Success " });
  } catch (error) {
    console.error("Error adding Video:", error);
    res.status(500).json({ message: "Error adding Video" });
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
  getAllVideos,
  getVideoByVendorId,
  getById,
  getByTag,
  getVideoByCategory,
  add,
  update,
  deleteC,
  archive,
  getVideosAnalyses,
};