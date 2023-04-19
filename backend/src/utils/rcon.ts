/*
	© 2019 - 2021, Nimplex, All rights reserved.
	This code is under MIT license. Read more: https://choosealicense.com/licenses/mit

	nercon - eddited
*/

// standard nodejs socket library
import dgram from "dgram";
import logger from "./logger";

export interface config {
	port: number;
	host: string;
	pass: string;
}

export class RCON {
	private config: config;
	public timeout = 1500;

	constructor(config: config) {
		this.config = config;
	}

	async send(
		cmd: string,
		resolve?: () => void,
		reject?: (reason: string) => void
	): Promise<void> {
		const connection = dgram.createSocket("udp4");
		const connBuffer = Buffer.alloc(
			11 + this.config.pass.length + cmd.length
		); // allocate memory

		const pass = this.config.pass;
		const passLen = pass.length;

		let messageout: NodeJS.Timeout;

		connBuffer.writeUInt32LE(0xffffffff, 0);
		connBuffer.write("rcon ", 4);
		connBuffer.write(pass, 9, passLen);
		connBuffer.write(" ", 9 + passLen, 1);
		connBuffer.write(cmd, 10 + passLen, cmd.length);
		connBuffer.write("\n", 10 + passLen + cmd.length, 1);

		const connectionout = setTimeout(() => {
			// connection.close()
			logger.error("RCON Connection timeout");
			if (reject) reject("Timeout");
		}, this.timeout);

		connection.on("message", () => {
			clearTimeout(connectionout); // stop connectiontimeout event
			clearTimeout(messageout); // clear messageout (if there is something already)

			const resolveTimeout = setTimeout(
				() => (resolve ? resolve() : null),
				this.timeout + 500
			);
			messageout = setTimeout(() => {
				connection.close();
				if (reject) reject("Timeout");
				clearTimeout(resolveTimeout);
			}, this.timeout);
		});

		connection.send(
			connBuffer,
			0,
			connBuffer.length,
			this.config.port,
			this.config.host,
			(error: Error | null, _: number) => {}
		);
	}
}
