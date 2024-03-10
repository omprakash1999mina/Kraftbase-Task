import express from "express";
const router = express.Router();
import auth from "../middleware/auth";
import { forgotPasswordController, loginController, menuController, orderController, otpController, refreshController, registerController, userController } from '../controllers';

router.post('/restaurants/register', registerController.register);
router.post('/restaurants/update', [auth], userController.update);
router.post('/restaurants/login', loginController.login);
router.post('/restaurants/logout', loginController.logout);
router.post('/restaurants/refresh', refreshController.refresh);
router.get('/restaurants/:id', [auth], userController.getrestaurantsOne);
router.post('/restaurants/email/verify', otpController.send);
router.post('/restaurants/forgot/password', forgotPasswordController.forgot);

router.post('/orders/status/update', [auth], orderController.update_status);
router.get('/orders/:id', [auth], orderController.get_status);

router.post('/menu/create', [auth], menuController.create);
router.post('/menu/update', [auth], menuController.update);
router.get('/menu/:id', [auth], menuController.getMenu);

// router.get('/metrics', PrometheusMetricsController.generate);
export default router;