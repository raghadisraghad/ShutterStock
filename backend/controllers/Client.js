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
        {
            $group: {
                _id: "$client",
                activityCount: { $sum: 1 },
            },
        },
        { $sort: { activityCount: -1 } },
        { $limit: 1 },
    ]);
    const populatedMostActiveUser = await Target.populate(mostActiveUser, { path: "_id" });

    const topProductVendors = await Orders.aggregate([
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
        { $match: { "productDetails.type": "product" } }, // Match product type
        { $group: { _id: "$productDetails.vendor", totalRevenue: { $sum: "$total" } } },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
    ]);
    const populatedTopProductVendors = await Target.populate(topProductVendors, { path: "_id" });

    const topServiceVendors = await Orders.aggregate([
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
        { $match: { "productDetails.type": "service" } }, // Match service type
        { $group: { _id: "$productDetails.vendor", totalRevenue: { $sum: "$total" } } },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
    ]);
    const populatedTopServiceVendors = await Target.populate(topServiceVendors, { path: "_id" });

    const topClientsByPurchases = await Orders.aggregate([
        { $group: { _id: "$client", totalPurchases: { $sum: 1 } } },
        { $sort: { totalPurchases: -1 } },
        { $limit: 5 },
    ]);
    const populatedTopClientsByPurchases = await Target.populate(topClientsByPurchases, { path: "_id" });

    const topClientsBySpending = await Orders.aggregate([
        { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
    ]);
    const populatedTopClientsBySpending = await Target.populate(topClientsBySpending, { path: "_id" });

    const adminUsers = await Target.find({ role: "0" }).sort({ dateCreated: 1 }).limit(5);

    const vendorRevenueComparison = await Orders.aggregate([
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
            $match: {
                "productDetails.type": { $in: ["product", "service"] },
            },
        },
        {
            $group: {
                _id: "$productDetails.type",
                totalRevenue: { $sum: "$total" },
            },
        },
    ]);

    const averageClientSpending = await Orders.aggregate([
        { $group: { _id: "$client", totalSpent: { $sum: "$total" } } },
        {
            $group: {
                _id: null,
                averageSpending: { $avg: "$totalSpent" },
            },
        },
    ]);

    res.status(200).json({
        mostActiveUser: populatedMostActiveUser,
        topProductVendors: populatedTopProductVendors,
        topServiceVendors: populatedTopServiceVendors,
        topClientsByPurchases: populatedTopClientsByPurchases,
        topClientsBySpending: populatedTopClientsBySpending,
        adminUsers,
        vendorRevenueComparison,
        averageClientSpending: averageClientSpending[0]?.averageSpending || 0,
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