import { red, cyan, grey, yellow, green } from "chalk"

export const getTime = (): string =>
	`${("0" + new Date().getHours()).slice(-2)}:${(
		"0" + new Date().getMinutes()
	).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)}`

export default {
	error: (message: any): void =>
		console.error(`${red("ERROR")} [${grey(getTime())}] | ${message}`),
	ready: (message: any): void =>
		console.log(`${green("READY")} [${grey(getTime())}] | ${message}`),
	log: (message: any): void =>
		console.log(`${cyan("LOG")}   [${grey(getTime())}] | ${message}`),
	warn: (message: any): void =>
		console.warn(`${yellow("WARN")}  [${grey(getTime())}] | ${message}`),
}
