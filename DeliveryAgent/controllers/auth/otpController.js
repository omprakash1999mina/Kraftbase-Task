import Joi from 'joi';
import { Agent } from "../../models";
import CustomErrorHandler from '../../Services/CustomerrorHandler';
import discord from '../../Services/discord';
import RedisService from '../../Services/redis';
import KafkaService from '../../Services/Kafka';
import { OWNER_EMAIL,TEMPLATE_ID_FORGOT_PASSWORD } from '../../config';

const otpController = {

    async send(req, res, next) {

        const otpSchema = Joi.object({
            email: Joi.string().email().required(),
        });

        const { error } = otpSchema.validate(req.body);

        if (error) {
            return next(CustomErrorHandler.badRequest());
        }
        //   DataBasse   
        try {
            const { email } = req.body;
            const agent = await Agent.findOne({ email: email });
            if (!agent) {
                discord.SendErrorMessageToDiscord(email, "OTP SEND", "Agent not exist in our database !!");
                return next(CustomErrorHandler.unAuthorized())
            }
            const otp = generateOtpCode();
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            // sending mail to Agent
            const data = { To: email,userName: agent.name, code: otp.toString(), From: `${OWNER_EMAIL}`, MailName: "", Subject: "Regarding OTP", company: "Kraftbase", TemplateId: `${TEMPLATE_ID_FORGOT_PASSWORD}` }
            KafkaService.send([data]);
            const ttl = 60 * 10; // for 10 mins
            const ok = RedisService.createRedisClient().set(email, otp, "EX", ttl);
            if (!ok) {
                Logger.error("OTP SEND", "error in setup the otp in redis !!");
                discord.SendErrorMessageToDiscord(email, "OTP SEND", "error in setup the otp in redis !!");
                return next(CustomErrorHandler.serverError());
            }
            // }
            // else {
            //     discord.SendErrorMessageToDiscord(email, "OTP SEND", "error in setup the otp in redis !!");
            //     return next(CustomErrorHandler.serverError());
            // }

        } catch (err) {
            Logger.error("OTP SEND", err);
            discord.SendErrorMessageToDiscord(req.body.email, "OTP SEND", err);
            return next(CustomErrorHandler.serverError());
        }
        res.status(201).json({ status: "success", msg: "mail sent Successfully !!!  " });
    }
}

export default otpController;
const generateOtpCode = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
}
