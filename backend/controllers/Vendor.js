import asyncHandler from 'express-async-handler';
import Target from '../models/User.js';


const add = asyncHandler(async (req, res) => {
    const target = new Target(req.body)
    await target.save()
    res.status(200).json({message : "Operation Success "})
});

const update = asyncHandler(async (req, res) => {
    const {id}= req.params
    const target = await Target.findByIdAndUpdate(id,req.body,{new:true});
    if (!target) {
        return res.status(404).send({ error: 'Target Not Found!' });
    }
    res.status(200).json({message: "Updated Successfully"})
});
  
const deleteC = asyncHandler(async (req, res) => {
    const {id}= req.params;
    const target = await Target.findByIdAndDelete(id);
    if(!target){
    res.status(404).json({message:"Target Doesn't Exist !!!"})
    }
    res.status(200).json({message: "Target Deleted Successfully"})
});

export {
    add,
    update,
    deleteC
};