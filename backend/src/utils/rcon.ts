/*
	© 2019 - 2021, Nimplex, All rights reserved.
	This code is under MIT license. Read more: https://choosealicense.com/licenses/mit

	nercon - eddited
*/

// standard nodejs socket library
import dgram from "dgram"
import logger from "./logger"

export interface config {
	port: number
	host: string
	pass: string
}

export class RCON {
	private config: config
	public timeout: number = 1500

	constructor(config: config) {
		this.config = config
	}

	async send(cmd: string): Promise<void> {
		const connection = dgram.createSocket("udp4")
		const connBuffer = Buffer.alloc(
			11 + this.config.pass.length + cmd.length
		) // allocate memory

		const pass = this.config.pass
		const passLen = pass.length

		let messageout: NodeJS.Timeout, connectionout: NodeJS.Timeout

		// Prepare buffer
		connBuffer.writeUInt32LE(0xffffffff, 0) // magic code
		connBuffer.write("rcon ", 4)
		connBuffer.write(pass, 9, passLen)
		connBuffer.write(" ", 9 + passLen, 1)
		connBuffer.write(cmd, 10 + passLen, cmd.length)
		connBuffer.write("\n", 10 + passLen + cmd.length, 1)

		connectionout = setTimeout(() => {
			connection.close()
			logger.error("Connection timeout")
		}, this.timeout)

		connection.on("message", () => {
			clearTimeout(connectionout) // stop connectiontimeout event
			clearTimeout(messageout) // clear messageout (if there is something already)

			messageout = setTimeout(() => {
				connection.close()
			}, this.timeout)
		})

		connection.send(
			connBuffer,
			0,
			connBuffer.length,
			this.config.port,
			this.config.host,
			(error: Error | null, _: number) => {
				if (error) {
					connection.close()
				}
			}
		)
	}
}
