import { readFileSync } from "fs";
import { join } from "path";

export interface PlayerElement {
	license: string
	name: string
	playTime: number
	tsJoined: number
	tsLastConnection: number
	notes: Notes
}

export interface Players {
	version: number
	players: PlayerElement[]
}

export interface Notes {
	text: string
	lastAdmin: string
	tsLastEdit: number
}

export interface PlayerShort {
	license: string
	playTime: number
}

// prettier-ignore
const prodPath = join("/", "home", "rdm", "server", "base", "txData", "default", "data", "playersDB.json");
const devPath = join(__dirname, "..", "..", "..", "..", "playersDB.json");

export class PlayerDataManager {
	public players: PlayerShort[];

	constructor() {
		// prettier-ignore
		const json: Players = JSON.parse(readFileSync(process.env.NODE_ENV == "production" ? prodPath : devPath, { encoding: "utf-8" }).toString());
		this.players = json.players.map(({ license, playTime }) => ({
			license,
			playTime,
		}));
	}

	getUser(license: string): PlayerShort {
		const player = this.players.find(user => user.license == license);

		if (!player)
			return {
				license,
				playTime: 0,
			};

		return player;
	}
}
