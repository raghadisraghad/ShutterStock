import asyncHandler from 'express-async-handler';
import Target from '../models/User.js';
import Product from '../models/Product.js';
import bcrypt from 'bcryptjs';


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

    if(updateData.currentPassword){
        const isPasswordValid = await bcrypt.compare(updateData.currentPassword, targetCheck.password);
        if(isPasswordValid){
            if (updateData.password && updateData.password !== targetCheck.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }
            else{
                updateData.password = targetCheck.password;
            }
        }else
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

    const products = await Product.find({ client : id });

    products.forEach((product) => {
        product.archive = true;
    });

    const uploadProductDirectory = path.join(process.env.UPLOAD_DIRECTORY, 'Products');
    const userDirectory = path.join(uploadProductDirectory, username.toString());
    if (fs.existsSync(userDirectory)) {
        if (fs.existsSync(userDirectory)) {
            fs.rm(userDirectory, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error('Error deleting folder:', err);
                    return;  
                }
                console.log('Folder deleted successfully');
            });
        } else {
            console.log('User directory not found.');
        }
    }

    res.status(200).json({ message: "Target Deleted Successfully" })
});

export {
    add,
    update,
    deleteC
};