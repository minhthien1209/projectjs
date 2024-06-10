import express from 'express';
import { Create, Remove, Update, getAll, getDetail } from '../controller/product.js';
const router = express.Router();

router.get('/', getAll);
router.get('/:id', getDetail);
router.post('/create', Create);
router.put('/update', Update);
router.delete('/remove', Remove);

export default router;