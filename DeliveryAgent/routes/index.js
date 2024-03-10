const router = express.Router();
import express from "express";
import auth from "../middleware/auth";
import { forgotPasswordController, loginController, orderController, otpController, refreshController, registerController, userController} from '../controllers';


router.get('/users/:id', [auth], userController.getUsersOne);
router.post('/user/logout', loginController.logout);
router.post('/email/verify', otpController.send);
router.post('/forgot/password', forgotPasswordController.forgot);
router.post('/login', loginController.login);
router.post('/register', registerController.register);
router.post('/refresh', refreshController.refresh);
// router.get('/metrics', PrometheusMetricsController.generate);

router.post('/order/update/status', [auth], orderController.status);

export default router;