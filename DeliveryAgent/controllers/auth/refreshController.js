import Joi from 'joi';
import { Agent } from "../../models";
import CustomErrorHandler from '../../Services/CustomerrorHandler';
import JwtService from '../../Services/JwtService';
import { REFRESH_SECRET } from '../../config';
import discord from '../../Services/discord';
import RedisService from '../../Services/redis';


const refreshController = {

    async refresh(req, res, next) {
        // refresh  Logic

        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }
        //   DataBasse   
        let refreshtoken;

        try {
            let AgentId;
            try {
                const { _id } = JwtService.verify(req.body.refresh_token, REFRESH_SECRET);
                AgentId = _id;
                const redis = RedisService.createRedisClient();
                await redis.get(AgentId).then((res) => {
                    refreshtoken = res;
                    redis.disconnect();
                })
                if (refreshtoken === null) {
                    discord.SendErrorMessageToDiscord(req.body.refresh_token, "Refresh token", "invalid refresh token !!");
                    return next(CustomErrorHandler.unAuthorized(' Invalid refresh token'));
                }

            } catch (err) {
                discord.SendErrorMessageToDiscord(req.body.refresh_token, "Refresh token", err);
                return next(CustomErrorHandler.unAuthorized('  Invalid refresh token'));
            }

            const agent = await Agent.findOne({ _id: AgentId });
            if (!agent) {
                discord.SendErrorMessageToDiscord(req.body.refresh_token + "\n" + AgentId, "Refresh token", "invalid refresh token Agent not exist !!");
                return next(CustomErrorHandler.unAuthorized('  Invalid refresh token !!  '));
            }

            //       Tokens
            const access_token = JwtService.sign({ _id: agent._id });
            const refresh_token = req.body.refresh_token;

            res.status(200).json({ access_token, refresh_token });
        } catch (err) {
            return next(new Error("Something went wrong  !!! " + err.message));
        }

    }
}

export default refreshController;
