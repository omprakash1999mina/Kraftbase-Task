import express from "express";
const router = express.Router();
import auth from "../middleware/auth";
import { orderController } from '../controllers';

router.post('/orders', [auth], orderController.store);
router.get('/orders/:id', [auth], orderController.getorders);
// router.get('/metrics', PrometheusMetricsController.generate);
export default router;