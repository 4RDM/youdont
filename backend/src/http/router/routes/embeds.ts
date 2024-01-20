import { Router } from "express";
import { badRequest, internalError, notFound } from "../errors";

import rateLimit from "express-rate-limit";
import { Embed } from "utils/embedBuilder";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: true
});

const router = Router();

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    const embed = req.core.embedCache.get(id);

    if (embed === undefined) {
        req.skip = true;
        return next();
    }

    return res.json({ code: 200, embed });
}, limiter, async (_, res) => {
    return notFound(res);
});

router.post("/:id", limiter, async (req, res) => {
    try {
        const id = req.params.id;
        const embed = req.core.embedCache.get(id);

        if (embed === undefined)
            return notFound(res);

        const { title, description, color, footer, thumbnail, image, fields } =
            Object.assign({
                title: "",
                description: "",
                color: "",
                footer: "",
                thumbnail: "",
                image: "",
                fields: []
            }, req.body);

        const channel = await req.core.channels.fetch(embed.channelID);

        if (!channel)
            return internalError(res, "Channel not found");

        if (!channel.isTextBased())
            return badRequest(res, "Channel is not text based");

        await channel.send({
            embeds: [
                Embed({
                    title,
                    description,
                    color,
                    footer,
                    thumbnail,
                    image,
                    fields
                })
            ],
        }).catch(err => {
            return internalError(res, err);
        });

        req.core.embedCache.delete(id);

        res.json({ code: 200 });
    } catch (err) {
        return internalError(res, err as string);
    }
});

export default router;
