import { HexColorString } from "discord.js";

const x = (s: string) => parseInt(s, 16);

export default function (hex: HexColorString): {
	r: number
	g: number
	b: number
} {
	const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return r ? { r: x(r[1]), g: x(r[2]), b: x(r[3]) } : { r: 0, g: 0, b: 0 };
}
