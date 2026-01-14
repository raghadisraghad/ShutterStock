import asyncHandler from 'express-async-handler';
import Target from '../models/Service.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const getServiceByVendorId = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  const target = await Target.find({ vendor: vendorId }).populate('vendor');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getAllServices = asyncHandler(async (req, res) => {
  const target = await Target.find().populate('vendor');
  res.status(200).json(target);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const target = await Target.findById(id).populate('vendor');
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }
  res.status(200).json(target);
});

const getServicesAnalyses = asyncHandler(async (req, res) => {
  const mostSoldServices = await Order.aggregate([
    { $unwind: "$service" },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceDetails",
      },
    },
    { $unwind: "$serviceDetails" },
    { $group: { _id: "$serviceDetails._id", totalSold: { $sum: 1 } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);
  const populatedMostSoldServices = await Target.populate(mostSoldServices, { path: "_id" });

  const topVendorsByServiceSalesAgg = await Order.aggregate([
    { $unwind: "$service" },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceDetails",
      },
    },
    { $unwind: "$serviceDetails" },
    { $group: { _id: "$serviceDetails.vendor", totalSales: { $sum: "$total" } } },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
  ]);
  const topVendorsByServiceSales = await User.populate(topVendorsByServiceSalesAgg, {
    path: "_id",
    match: { role: { $in: ["2", "3"] } },
    select: "username",
  });

  const topVendorsByServicesAgg = await Target.aggregate([
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
    { $unwind: "$service" },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceDetails",
      },
    },
    { $unwind: "$serviceDetails" },
    { $group: { _id: "$serviceDetails._id", totalRevenue: { $sum: "$total" } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);
  const topRevenueGeneratingServices = await Target.populate(topRevenueGeneratingServicesAgg, { path: "_id" });

  const topSpendingCustomersOnServicesAgg = await Order.aggregate([
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceDetails",
      },
    },
    { $unwind: "$serviceDetails" },
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
    topVendorsByServiceSales,
    topVendorsByServices,
    topRevenueGeneratingServices,
    topSpendingCustomersOnServices,
  });
});

const add = asyncHandler(async (req, res) => {
  try {
    const { serviceData } = req.body;
    const service = await Target.findOne({ title: serviceData.title });

    if (service) {
      return res.status(409).send({ error: 'Service with that title already exist!' });
    }

    const target = new Target(serviceData);
    await target.save();
    res.status(201).json({ message: "Operation Success " });
  } catch (error) {
    res.status(500).json({ message: "Error adding service" });
  }
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const serviceData = req.body.serviceData;
  const service = await Target.findById(id);
  if (serviceData.title && serviceData.title !== service.title) {
    const existingService = await Target.findOne({ title: serviceData.title });

    if (existingService) {
      return res.status(409).send({ error: 'service Title Already Occupied!' });
    }
  }

  const target = await Target.findByIdAndUpdate(id, serviceData, { new: true });
  if (!target) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }

  res.status(200).json({ message: "Updated Successfully" });
});

const deleteC = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const target = await Target.findByIdAndDelete(id);
  if (!target) {
    res.status(404).json({ message: "Target Doesn't Exist !!!" });
  }
  res.status(200).json({ message: "Target Archived Successfully" });
});

export {
  getServiceByVendorId,
  getAllServices,
  getById,
  add,
  update,
  deleteC,
  getServicesAnalyses
};
