const express = require("express");
const router = express.Router();
const Target = require("../models/Tag");

router.get("/", async (req, res) => {
  try {
    const target = await Target.find();
    res.status(200).json(target);
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.get("/:name", async (req, res) => {
    try {
      const {name} = req.params
      const target = await Target.findOne({ name: name });
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

module.exports =  {
  getAll: router.stack[0].handle,
  getByName: router.stack[1].handle
}