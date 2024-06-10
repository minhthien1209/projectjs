import express from 'express';
import routerProduct from './product.js';
import routerCategory from './category.js';

const router = express.Router();

router.use('/product', routerProduct);
router.use('/category', routerCategory);
export default router;