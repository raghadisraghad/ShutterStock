const express = require("express");
const router = express.Router();
const Target = require("../models/Product");
const Tag = require("../models/Tag");
const Category = require("../models/Category");

router.get("/products", async (req, res) => {
  try {
    const target = await Target.find({ type: 'product' });
    res.status(200).json(target);
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/products/:vendorId", async (req, res) => {
    try {
      const {vendorId} = req.params
      const target = await Target.find({ type: 'product', vendor : vendorId });
      if (!target) {
        return res.status(404).send({ error: 'Target Not Found!' });
      }
      res.status(200).json(target);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});

router.get("/services/:vendorId", async (req, res) => {
  try {
    const {vendorId} = req.params
    const target = await Target.find({ type: 'service', vendor : vendorId });
    if (!target) {
      return res.status(404).send({ error: 'Target Not Found!' });
    }
    res.status(200).json(target);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/services", async (req, res) => {
  try {
    const target = await Target.find({ type: 'service' });
    res.status(200).json(target);
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const {id} = req.params
      const target = await Target.findById(id);
      if (!target) {
        return res.status(404).send({ error: 'Target Not Found!' });
      }
      res.status(200).json(target);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});

router.get("/product/tag/:search", async (req, res) => {
    try {
      const {search} = req.params
      const tag = await Tag.findOne({ name: search });
      if (!tag) {
        return res.status(404).send({ error: 'Tag Not Found!' });
      }
      const target = await Target.find({ tag: tag._id });
      if (target.length === 0) {
        return res.status(404).json({ message: 'No products found for this tag' });
      }
      res.status(200).json(target);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});

router.get("/product/category/:search", async (req, res) => {
    try {
      const {search} = req.params
      const category = await Category.findOne({ name: search });
      if (!category) {
        return res.status(404).send({ error: 'Category Not Found!' });
      }
      const target = await Target.find({ category: category._id });
      if (target.length === 0) {
        return res.status(404).json({ message: 'No products found for this category' });
      }
      res.status(200).json(target);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});

router.post("/", async (req, res) => {
  try {
    const target = new Target(req.body)
    await target.save()
    res.status(200).json({message : "Operation Success "})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {id}= req.params
    const target = await Target.findByIdAndUpdate(id,req.body,{new:true});
    if (!target) {
        return res.status(404).send({ error: 'Target Not Found!' });
    }
    res.status(200).json({message: "Updated Successfully"})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const {id}= req.params
    const target = await Target.findByIdAndDelete(id);
    if(!target){
      res.status(404).json({message:"Target Doesn't Exist !!!"})
    }
    res.status(200).json({message: "Target Deleted Successfully"})
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = {
  getAllProducts: router.stack[0].handle,
  getAllServices: router.stack[1].handle,
  getById: router.stack[2].handle,
  getByTag: router.stack[3].handle,
  getByCategory: router.stack[4].handle
}