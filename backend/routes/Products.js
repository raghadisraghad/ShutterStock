import express from 'express';
import { getAllProducts, getProductByVendorId, getServiceByVendorId, getAllServices, getById, getByTag, getProductByCategory, getServiceByCategory, add, update, deleteC, archive } from '../controllers/Products.js';

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:vendorId", getProductByVendorId);
router.get("/services/:vendorId", getServiceByVendorId);
router.get("/services", getAllServices);
router.get("/:id", getById);
router.get("/product/tag/:search", getByTag);
router.get("/product/category/:search", getProductByCategory);
router.get("/service/category/:search", getServiceByCategory);
router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);
router.put("/archive/:id", archive);

export default router;