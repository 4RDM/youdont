import express from "express";
import session, { Session } from "express-session";
import expressWs, { Application } from "express-ws";
import { WebSocket } from "ws";

import { RDMBot } from "../main";
import logger from "../utils/logger";

import compression from "compression";
import MemoryStore from "memorystore";

import indexRouter from "./router";
import apiRouter from "./router/api";
import { join } from "path";

const port = 8020;

declare module "express-serve-static-core" {
    interface Request {
        core: RDMBot;
        skip: boolean;
        session: Session & {
            username?: string;
            userid?: string;
            tag?: string;
            email?: string;
            avatar?: string;
        };
    }
}

export default class HTTP {
    public server: Application = expressWs(express()).app;
    public wssclients: WebSocket[] = [];

    constructor(core: RDMBot) {
        const memoryStore = MemoryStore(session);

        this.server.use(
            session({
                secret: "{/GDB4pZjG[CG45_Y8yp~3Km,T$A(Em.]x{9g4'7>@fu&h^g",
                store: new memoryStore({ checkPeriod: 86400000 }),
                resave: false,
                saveUninitialized: false,
            })
        );

        this.server.use(compression());

        this.server.use((req, _, next) => {
            req.core = core;
            req.skip = false;
            next();
        });
        
        this.server.set("trust proxy", "127.0.0.1");

        this.server.get("/sitemap.xml", (_, res) => res.sendFile(join(__dirname, "..", "..", "..", "frontend", "dist", "assets", "sitemap.xml")));
        this.server.use("/api", apiRouter);
        this.server.use("/", indexRouter);
    }
    listen() {
        this.server.listen(port, () =>
            logger.ready(`Website is listening to port ${port}`)
        );
    }
}
