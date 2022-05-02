/* eslint-disable @typescript-eslint/no-explicit-any */
import mariadb from "mariadb";
import { Core } from "../index";
import config from "../config";
import logger from "./logger";

interface User {
	name: string;
	value: string;
}

interface ICache {
	players: number;
	top: {
		kills: User[];
		deaths: User[];
		kdr: User[];
	};
}

export const getCache = (core: Core) => {
	const cache = core.cache.get("SR_CACHE") as ICache || null;

	if (!cache) {
		const dataCache: ICache = { players: 0, top: { kills: [], deaths: [], kdr: [] } };
		core.cache.set("SR_CACHE", dataCache);
		return dataCache;
	} else return cache;
};

export const getPlayers = (core: Core): ICache["players"] => {
	const cache = getCache(core);
	return cache.players;
};

export const getTops = (core: Core): ICache["top"] => {
	const cache = getCache(core);
	return cache.top;
};

export const refreshTops = async(core: Core) => {
	return await retry(async() => {
		const connection = await mariadb.createConnection({
			host: config.mysql.host,
			user: config.mysql.user,
			password: config.mysql.password,
			database: "rdm",
			allowPublicKeyRetrieval: true,
		});

		const killTop = await connection.query("SELECT (@counter := @counter + 1) AS position, users.name, kdr.kills FROM kdr JOIN users ON kdr.identifier=users.identifier CROSS JOIN (SELECT @counter := 0) AS dummy ORDER BY kills DESC LIMIT 10");
		const deathsTop = await connection.query("SELECT (@counter := @counter + 1) AS position, users.name, kdr.deaths FROM kdr JOIN users ON kdr.identifier=users.identifier CROSS JOIN (SELECT @counter := 0) AS dummy ORDER BY deaths DESC LIMIT 10");
		const kdrTop = await connection.query("SELECT (@counter := @counter + 1) AS position, users.name, ROUND(kdr.kills/kdr.deaths, 2) FROM kdr JOIN users ON kdr.identifier=users.identifier CROSS JOIN (SELECT @counter := 0) as dummy WHERE kdr.kills > 500 AND kdr.deaths > 1 ORDER BY kdr.kills/kdr.deaths DESC LIMIT 10");
		
		connection.end();

		const kills: User[] = killTop.map((user: any) => {
			return {
				value: user.kills,
				name: user.name,
			};
		});
		const deaths: User[] = deathsTop.map((user: any) => {
			return {
				value: user.deaths,
				name: user.name,
			};
		});
		const kdr = kdrTop.map((user: any) => {
			return {
				value: user["ROUND(kdr.kills/kdr.deaths, 2)"],
				name: user.name,
			};
		});

		const cache = getCache(core);
		cache.top = { kills, deaths, kdr };
		core.cache.set("SR_CACHE", cache);
	}, 2);
};

export const refreshUsers = async(core: Core) => {
	return await retry(async() => {
		const res = await fetch(`http://127.0.0.1:${config.rcon.port}/players.json`)
			.catch((err) => logger.error(`Cannot fetch players. ${err}`));

		if (!res) return logger.error("Cannot fetch players.");
		const json = await res.json();

		const cache = getCache(core);
		cache.players = json.length;
		core.cache.set("SR_CACHE", cache);
	}, 2);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const retry = async(callback: () => Promise<unknown>, nth: number) => {
	try {
		await callback();
		return true;
	} catch(e) {
		if (nth == 0) return false;
		return await retry(callback, nth - 1);
	}
};