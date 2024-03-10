const router = express.Router();
import express from "express";
import auth from "../middleware/auth";
import { forgotPasswordController, loginController, orderController, otpController, refreshController, registerController, userController} from '../controllers';

router.get('/agents/:id', [auth], userController.getUsersOne);
router.post('/agents/update', [auth], userController.update);
router.post('/agents/logout', loginController.logout);
router.post('/agents/email/verify', otpController.send);
router.post('/agents/forgot/password', forgotPasswordController.forgot);
router.post('/agents/login', loginController.login);
router.post('/agents/register', registerController.register);
router.post('/agents/refresh', refreshController.refresh);
// router.get('/metrics', PrometheusMetricsController.generate);

router.post('/order/update/status', [auth], orderController.status);

export default router;