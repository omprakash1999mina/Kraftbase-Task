import Joi from 'joi';
import { Restaurant } from "../../models";
import CustomErrorHandler from '../../Services/CustomerrorHandler';
import bcrypt from 'bcrypt';
import JwtService from '../../Services/JwtService';
import discord from '../../Services/discord';
import RedisService from '../../Services/redis';
import KafkaService from '../../Services/Kafka';
import { OWNER_EMAIL, TEMPLATE_ID_SIGNUP_SUCCESS } from '../../config';

const registerController = {

    async register(req, res, next) {
        // validation
        const registerSchema = Joi.object({
            userName: Joi.string().min(3).max(100).required(),
            email: Joi.string().email().required(),
            address: Joi.string().required(),
            menuId: Joi.string().required(),
            status_id: Joi.number().required(),
            password: Joi.string().min(8).max(50).required()
        });

        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(CustomErrorHandler.badRequest());
        }
        try {
            const exist = await Restaurant.exists({ email: req.body.email });
            if (exist) {
                // implementation for discord error logs
                discord.SendErrorMessageToDiscord(req.body.email, "Register User", "error the email is already exist ");
                return next(CustomErrorHandler.alreadyExist('This email is already taken . '));
            }
        } catch (err) {
            return next(err);
        }
        const { userName, email, status_id, address, menuId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const status_Array = ["Available","Closed"];
        if(status_id<0 || status_id>1) return next(CustomErrorHandler.badRequest());

        let document;
        let access_token;
        let refresh_token;

        try {
            document = await Restaurant.create({
                userName,
                email,
                menuId,
                address,
                status: status_Array[status_id],
                password: hashedPassword
            });
            // console.log(document);

            access_token = JwtService.sign({ refresh_token: document._id });
            refresh_token = JwtService.sign({ _id: document._id });
            //redis caching
            const data = { To: email, userName: userName, From: `${OWNER_EMAIL}`, MailName: "", Subject: "Successfully Registered", company: "Kraftbase", TemplateId: `${TEMPLATE_ID_SIGNUP_SUCCESS}` }
            KafkaService.send([data]);
            const ttl = 60 * 60 * 24 * 7;
            const working = RedisService.createRedisClient().set(document._id, refresh_token, "EX", ttl);
            // const working = RedisService.set(email, refresh_token, ttl);
            if (!working) {
                discord.SendErrorMessageToDiscord(email, "LogIN", "error in setup the otp in redis !!");
                return next(CustomErrorHandler.serverError());
            }

        } catch (err) {
            discord.SendErrorMessageToDiscord(req.body.email, "Register User", err);
            return next(err);
        }
        res.status(201).json({ id: document._id, msg: "User Registered Successfully.", access_token: access_token, refresh_token: refresh_token });
    }
};

export default registerController;