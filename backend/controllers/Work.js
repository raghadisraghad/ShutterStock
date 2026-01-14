import asyncHandler from 'express-async-handler';
import Target from '../models/Work.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const getWorkByVendorId = asyncHandler(async (req, res) => {
  const { vendorId } = req.params
  const target = await Target.find({ vendor: vendorId }).populate('vendor');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getAllWorks = asyncHandler(async (req, res) => {
  const target = await Target.find().populate('vendor');
  res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const target = await Target.findById(id).populate('vendor');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getWorksAnalyses = asyncHandler(async (req, res) => {
  // Most Sold Works
  const mostSoldWorks = await Order.aggregate([
    { $unwind: "$Work" },
    {
      $lookup: {
        from: "Works",
        localField: "Work",
        foreignField: "_id",
        as: "WorkDetails",
      },
    },
    { $unwind: "$WorkDetails" },
    { $group: { _id: "$WorkDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);
  const populatedMostSoldWorks = await Target.populate(mostSoldWorks, { path: "_id" });

  // Top Vendors by Work Sales
  const topVendorsByWorkSalesAgg = await Order.aggregate([
    { $unwind: "$Work" },
    {
      $lookup: {
        from: "Works",
        localField: "Work",
        foreignField: "_id",
        as: "WorkDetails",
      },
    },
    { $unwind: "$WorkDetails" },
    { $group: { _id: "$WorkDetails.vendor", totalSales: { $sum: "$total" } } },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
  ]);
  const topVendorsByWorkSales = await User.populate(topVendorsByWorkSalesAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  // Top Vendors by Number of Works
  const topVendorsByWorksAgg = await Target.aggregate([
    { $group: { _id: "$vendor", totalWorks: { $sum: 1 } } },
    { $sort: { totalWorks: -1 } },
    { $limit: 5 },
  ]);
  const topVendorsByWorks = await User.populate(topVendorsByWorksAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  // Top Revenue Generating Works
  const topRevenueGeneratingWorksAgg = await Order.aggregate([
    { $unwind: "$Work" },
    {
      $lookup: {
        from: "Works",
        localField: "Work",
        foreignField: "_id",
        as: "WorkDetails",
      },
    },
    { $unwind: "$WorkDetails" },
    { $group: { _id: "$WorkDetails._id", totalRevenue: { $sum: "$total" } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);
  const topRevenueGeneratingWorks = await Target.populate(topRevenueGeneratingWorksAgg, { path: "_id" });

  // Top Spending Customers on Works
  const topSpendingCustomersOnWorksAgg = await Order.aggregate([
    {
      $lookup: {
        from: "Works",
        localField: "Work",
        foreignField: "_id",
        as: "WorkDetails",
      },
    },
    { $unwind: "$WorkDetails" },
    { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
  ]);
  const topSpendingCustomersOnWorks = await User.populate(topSpendingCustomersOnWorksAgg, {
    path: "_id",
    match: { role: "1" },
    select: "username",
  });

  // Analysis for Products, Audios, and Videos
  const analysesByType = async (type) =>
    await Order.aggregate([
      { $unwind: "$Work" },
      {
        $lookup: {
          from: "Works",
          localField: "Work",
          foreignField: "_id",
          as: "WorkDetails",
        },
      },
      { $unwind: "$WorkDetails" },
      { $match: { "WorkDetails.type": type } },
      { $group: { _id: "$WorkDetails.vendor", totalRevenue: { $sum: "$total" } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

  const [topProductVendors, topAudioVendors, topVideoVendors] = await Promise.all([
    analysesByType("product"),
    analysesByType("audio"),
    analysesByType("video"),
  ]);

  res.status(200).json({
    mostSoldWorks: populatedMostSoldWorks,
    topVendorsByWorkSales,
    topVendorsByWorks,
    topRevenueGeneratingWorks,
    topSpendingCustomersOnWorks,
    topProductVendors,
    topAudioVendors,
    topVideoVendors,
  });
});

const add = asyncHandler(async (req, res) => {
  try {
    const { WorkData } = req.body;
    const Work = await Target.findOne({ title: WorkData.title });
    if(Work){
      return res.status(409).send({ error: 'Work with that title already exist!' });
    }
    
    const target = new Target(WorkData);
    await target.save();
    res.status(201).json({ message: "Operation Success " });
  } catch (error) {
    res.status(500).json({ message: "Error adding Work" });
  }
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const Work = await Target.findById(id);
  if(req.body.title && req.body.title !== Work.title){
    const existingWork = await Target.findOne({ title: req.body.title });
  
    if(existingWork){
      return res.status(409).send({ error: 'Work Title Already Occupied!' });
    }
  }
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
  getWorkByVendorId,
  getAllWorks,
  getById,
  add,
  update,
  archive,
  deleteC,
  getWorksAnalyses
};