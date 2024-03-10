import express from "express";
import auth from "../middleware/auth";
import { loginController, userController, refreshController, registerController, forgotPasswordController, otpController } from '../controllers';
const router = express.Router();

router.post('/login', loginController.login);
router.post('/forgot/password', forgotPasswordController.forgot);
router.post('/register', registerController.register);
router.post('/refresh', refreshController.refresh);
router.post('/logout', loginController.logout);
router.put('/update/:id', [auth], userController.update);
router.get('/users/:id', [auth], userController.getUsersOne);
router.post('/email/verify', otpController.send);
// router.get('/metrics', PrometheusMetricsController.generate);

export default router;