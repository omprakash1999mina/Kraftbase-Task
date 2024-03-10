import { User } from "../models";
import JwtService from "../Services/JwtService";
import CustomErrorHandler from "../Services/CustomerrorHandler";

const admin = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) return next(CustomErrorHandler.unAuthorized());
    const token = authHeader.split(' ')[1];
    try {
        const { _id } = JwtService.verify(token);
        const user = { _id }
        req.user = user;
        const users = User.findOne({ _id: _id })
        if (users && users.role == "admin") next();
        else next(CustomErrorHandler.unAuthorized());
    } catch (err) {
        return next(CustomErrorHandler.unAuthorized());
    }
}
export default admin;

