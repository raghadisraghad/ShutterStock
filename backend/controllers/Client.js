import asyncHandler from 'express-async-handler';
import Target from '../models/User.js';
import Orders from '../models/Order.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const getAll = asyncHandler(async (req, res) => {
  const target = await Target.find({ role: '1' });
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

const add = asyncHandler(async (req, res) => {
  const target = new Target(req.body)
  await target.save()
  res.status(200).json({ message: "Operation Success " })
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { ...updateData } = req.body;

  const targetCheck = await Target.findById(id);
  if (!targetCheck) {
    return res.status(404).send({ error: 'Target Not Found!' });
  }

  const checkEmail = await Target.findOne({ email: updateData.email });
  if (checkEmail && checkEmail.email !== targetCheck.email) {
    return res.status(400).send({ error: 'Email Already In Use' });
  }

  const checkUsername = await Target.findOne({ username: updateData.username });
  if (checkUsername && checkUsername.username !== targetCheck.username) {
    return res.status(400).send({ error: 'Username Already In Use' });
  }

  if (updateData.currentPassword) {
    const isPasswordValid = await bcrypt.compare(updateData.currentPassword, targetCheck.password);
    if (isPasswordValid) {
      if (updateData.password && updateData.password !== targetCheck.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      else {
        updateData.password = targetCheck.password;
      }
    } else
      return res.status(400).send({ error: 'Current Password Not correct' });
  }

  const target = await Target.findByIdAndUpdate(id, updateData, { new: true });
  res.status(200).json({ message: "Updated Successfully", user: target });
});

const deleteC = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const target = await Target.findByIdAndDelete(id);

  if (!target) {
    res.status(404).json({ message: "Target Doesn't Exist !!!" })
  }

  if (fs.existsSync(target.avatar)) {
    fs.unlink(target.avatar, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }
      console.log('File deleted successfully');
    });
  }

  const orders = await Orders.find({ client: id });

  orders.forEach((order) => {
    order.archive = true;
  });

  res.status(200).json({ message: "Target Deleted Successfully" })
});

const getUserRoleAnalyses = asyncHandler(async (req, res) => {
  const mostActiveUser = await Orders.aggregate([
    { $group: { _id: "$client", orderCount: { $sum: 1 } } },
    { $sort: { orderCount: -1 } },
    { $limit: 1 },
  ]);
  const populatedMostActiveUser = await Target.populate(mostActiveUser, { path: "_id" });

  // Top Vendors (Items - role "2")
  const topVendorsItems = await Orders.aggregate([
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
    {
      $lookup: {
        from: "users", // Changed to "users" because vendor is from User model
        localField: "productDetails.vendor",
        foreignField: "_id",
        as: "vendorDetails",
      },
    },
    { $unwind: "$vendorDetails" },
    { $match: { "vendorDetails.role": "2" } },
    { $group: { _id: "$vendorDetails._id", totalRevenue: { $sum: "$total" } } },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);
  const populatedTopVendorsItems = await Target.populate(topVendorsItems, { path: "_id" });

  // Top Clients (role "1")
  const topClients = await Orders.aggregate([
    { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
  ]);
  const populatedTopClients = await Target.populate(topClients, { path: "_id", match: { role: "1" } });

  // Vendor Revenue Comparison (Items, Video, Audio - Top 5 with highest percentage)
  const vendorRevenueComparison = await Orders.aggregate([
    { $facet: {
        products: [
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
          {
            $group: {
              _id: "$productDetails.vendor",
              revenue: { $sum: "$total" },
            },
          },
        ],
        videos: [
          { $unwind: "$video" },
          {
            $lookup: {
              from: "videos",
              localField: "video",
              foreignField: "_id",
              as: "videoDetails",
            },
          },
          { $unwind: "$videoDetails" },
          {
            $group: {
              _id: "$videoDetails.vendor",
              revenue: { $sum: "$total" },
            },
          },
        ],
        audios: [
          { $unwind: "$audio" },
          {
            $lookup: {
              from: "audios",
              localField: "audio",
              foreignField: "_id",
              as: "audioDetails",
            },
          },
          { $unwind: "$audioDetails" },
          {
            $group: {
              _id: "$audioDetails.vendor",
              revenue: { $sum: "$total" },
            },
          },
        ],
      }
    },
    { $project: {
        vendorRevenue: { $concatArrays: ["$products", "$videos", "$audios"] },
      }
    },
    { $unwind: "$vendorRevenue" },
    { $group: {
        _id: "$vendorRevenue._id",
        totalRevenue: { $sum: "$vendorRevenue.revenue" },
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
  ]);

  // Average Client Spending
  const averageClientSpending = await Orders.aggregate([
    { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
    {
      $group: {
        _id: null,
        averageSpending: { $avg: "$totalSpent" },
      },
    },
  ]);

  // Calculate percentages for Vendor Revenue Comparison
  const totalRevenue = vendorRevenueComparison.reduce((sum, vendor) => sum + vendor.totalRevenue, 0);
  vendorRevenueComparison.forEach((vendor) => {
    vendor.percentage = ((vendor.totalRevenue / totalRevenue) * 100).toFixed(2);
  });

  res.status(200).json({
    mostActiveUser: populatedMostActiveUser,
    topVendorsItems: populatedTopVendorsItems,
    topClients: populatedTopClients,
    averageClientSpending: averageClientSpending[0]?.averageSpending || 0,
    vendorRevenueComparison,
  });
});

export {
  getAll,
  getById,
  add,
  update,
  deleteC,
  getUserRoleAnalyses
};