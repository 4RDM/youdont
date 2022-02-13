/* eslint-disable @typescript-eslint/no-explicit-any */
import { red, cyan, grey, yellow, green } from "chalk";

export const gT = (): string =>
	`${("0" + new Date().getHours()).slice(-2)}:${(
		"0" + new Date().getMinutes()
	).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)}`;

export const cT = (m: any): any => m.join("\t");

export default {
	error: (...message: any): void =>
		console.error(`${red("ERROR")} [${grey(gT())}] | ${cT(message)}`),
	ready: (...message: any): void =>
		console.log(`${green("READY")} [${grey(gT())}] | ${cT(message)}`),
	log: (...message: any): void =>
		console.log(`${cyan("LOG")}   [${grey(gT())}] | ${cT(message)}`),
	warn: (...message: any): void =>
		console.warn(`${yellow("WARN")}  [${grey(gT())}] | ${cT(message)}`),
};
