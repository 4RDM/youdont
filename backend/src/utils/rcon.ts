// eslint-disable-next-line
// @ts-ignore
import Rcon from "quake3-rcon";
import config from "../config";
import logger from "./logger";

export default (command: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const rcon = new Rcon({
                address: config.rcon.host,
                port: config.rcon.port,
                password: config.rcon.password,
            });
            rcon.send(command, () => resolve());
        } catch (err) {
            logger.error(<string>err);
            reject();
        }
    });
};
