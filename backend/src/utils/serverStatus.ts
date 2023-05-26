import { Core } from "../core";
import config from "../config";
import logger from "./logger";

interface User {
	name: string;
	value: number;
}

export interface killTopResponse
	extends Array<{ position: number; name: string; kills: number }> {
	meta: unknown;
}

export interface deathsTopResponse
	extends Array<{ position: number; name: string; deaths: number }> {
	meta: unknown;
}

export interface kdrTopResponse
	extends Array<{ position: number; name: string; KDR: number }> {
	meta: unknown;
}

export interface playerResponse {
	endpoint: string;
	id: number;
	identifiers?: string[] | null;
	name: string;
	ping: number;
}

export const getTops = async (core: Core) => {
	try {
		if (!core.database.mariadb) return null;

		const connection = await core.database.mariadb.getConnection();

		const killTop: killTopResponse = await connection.query(
			"SELECT (@counter := @counter + 1) AS position, users.name, kdr.kills FROM kdr JOIN users ON kdr.identifier=users.identifier CROSS JOIN (SELECT @counter := 0) AS dummy ORDER BY kills DESC LIMIT 10"
		);
		const deathsTop: deathsTopResponse = await connection.query(
			"SELECT (@counter := @counter + 1) AS position, users.name, kdr.deaths FROM kdr JOIN users ON kdr.identifier=users.identifier CROSS JOIN (SELECT @counter := 0) AS dummy ORDER BY deaths DESC LIMIT 10"
		);
		const kdrTop: kdrTopResponse = await connection.query(
			"SELECT (@counter := @counter + 1) AS position, users.name, ROUND(kdr.kills/kdr.deaths, 2) as KDR FROM kdr JOIN users ON kdr.identifier=users.identifier CROSS JOIN (SELECT @counter := 0) as dummy WHERE kdr.kills > 500 AND kdr.deaths > 1 ORDER BY kdr.kills/kdr.deaths DESC LIMIT 10"
		);

		delete killTop["meta"];
		delete deathsTop["meta"];
		delete kdrTop["meta"];

		connection.end();

		const kills: User[] = killTop.map(user => {
			return {
				value: user.kills,
				name: user.name,
			};
		});
		const deaths: User[] = deathsTop.map(user => {
			return {
				value: user.deaths,
				name: user.name,
			};
		});
		const kdr = kdrTop.map(user => {
			return {
				value: user.KDR,
				name: user.name,
			};
		});

		return { kills, deaths, kdr };
	} catch (err) {
		logger.error(`MariaDB returned an error: ${err}`);

		return null;
	}
};

export const getPlayers = async () => {
	try {
		const res = await fetch(
			`http://${config.rcon.host}:${config.rcon.port}/players.json`
		);

		if (!res) return null;

		const json = await res.json();

		return json as playerResponse[];
	} catch (err) {
		return null;
	}
};
