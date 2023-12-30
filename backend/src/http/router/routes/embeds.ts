import { Router } from "express";
import { badRequest, internalError, notFound } from "../errors";

import rateLimit from "express-rate-limit";

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
    const id = req.params.id;
    const embed = req.core.embedCache.get(id);

    if (embed === undefined)
        return notFound(res);

    const { title, description, color, footer, thumbnail, image } = req.body;

    if (!title || !description || !color || !footer || !thumbnail || !image)
        return badRequest(res, "Missing parameters, { title: string, description: string, color: string, footer: string, thumbnail: string, image: string }");

    const channel = await req.core.channels.fetch(embed.channelID);

    if (!channel)
        return internalError(res, "Channel not found");

    if (!channel.isTextBased())
        return badRequest(res, "Channel is not text based");

    await channel.send({
        embeds: [
            {
                title,
                description,
                color,
                footer: {
                    text: footer,
                },
                thumbnail: {
                    url: thumbnail,
                },
                image: {
                    url: image,
                },
            }
        ],
    }).catch(err => {
        return internalError(res, err);
    });

    res.json({ code: 200 });
});

export default router;