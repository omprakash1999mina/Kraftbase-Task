import express from "express";
import auth from "../middleware/auth";
import admin from "../middleware/admin";
import { loginController, userController, refreshController, registerController, forgotPasswordController, otpController, restaurantController, feedbackController, orderController } from '../controllers';
const router = express.Router();

router.get('/users/:id', [auth], userController.getUsersOne);
router.post('/users/update', [auth], userController.update);
router.post('/users/logout', loginController.logout);
router.post('/users/email/verify', otpController.send);
router.post('/users/forgot/password', forgotPasswordController.forgot);
router.post('/users/login', loginController.login);
router.post('/users/register', registerController.register);
router.post('/users/refresh', refreshController.refresh);

router.get('/restaurants/all', restaurantController.get_All_Online);
router.get('/menu/:id', restaurantController.get_Menu);

router.post('/order/place', [auth], orderController.place);
router.get('/order/:id', [auth], orderController.get_Order_One);
router.get('/order/get/all', [auth], orderController.get_Order_All);

router.post('/feedback/post', [auth], feedbackController.post);
router.get('/feedback/get/all', [admin], feedbackController.get_All);
router.get('/feedback/get/:id', [auth], feedbackController.get_One);
router.delete('/feedback/delete/:id', [auth], feedbackController.destroy);
// router.get('/metrics', PrometheusMetricsController.generate);

export default router;