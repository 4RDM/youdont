// @ts-ignore
import Rcon from "quake3-rcon";
import config from "../config";
import logger from "./logger";

export default (command: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		try {
			const rcon = new Rcon({
				address: config.rcon.host,
				port: config.rcon.port,
				password: config.rcon.pass,
			});
			rcon.send(command, (res: string) => resolve());
		} catch (err) {
			logger.error(<string>err);
			reject();
		}
	});
};
