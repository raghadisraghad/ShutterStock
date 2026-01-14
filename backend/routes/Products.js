import express from 'express';
import { getAllProducts, getProductByVendorId, getById, getByTag, getProductByCategory, getProductsAnalyses, getProductsAnalysesId,getProductsAnalysesAllUsers, add, update, deleteC, archive } from '../controllers/Products.js';

const router = express.Router();

router.post("/", add);
router.put("/:id", update);
router.delete("/:id", deleteC);
router.put("/archive/:id", archive);

router.get("/", getAllProducts);
router.get("/:id", getById);
router.get("/vendor/:vendorId", getProductByVendorId);
router.get("/products/analysis", getProductsAnalyses);
router.get("/products/analysis/all", getProductsAnalysesAllUsers);
router.get("/products/analysis/:id", getProductsAnalysesId);
router.get("/tag/:search", getByTag);
router.get("/category/:search", getProductByCategory);

export default router;