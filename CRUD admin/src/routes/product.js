import express from 'express';
import { Create, Remove, Update, callback, getAll, getDetail, order_status, payment } from '../controller/product.js';
const router = express.Router();

router.get('/', getAll);
router.get('/:id', getDetail);
router.post('/', Create);
router.put('/:id', Update);
router.delete('/:id', Remove);
router.post('/payment', payment);
router.post('/callback', callback);
router.post('/order-status/:app_trans_id', order_status);

export default router;