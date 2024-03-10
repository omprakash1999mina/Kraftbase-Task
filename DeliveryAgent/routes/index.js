const router = express.Router();
import express from "express";
import auth from "../middleware/auth";
import { orderController} from '../controllers';
import { feedbackController} from '../controllers';

router.post('/message', feedbackController.create);
router.get('/order/update/status', [auth], orderController.status);
// router.get('/metrics', PrometheusMetricsController.generate);

export default router;