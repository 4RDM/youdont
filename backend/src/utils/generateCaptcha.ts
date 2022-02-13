import Jimp from "jimp";
import { join } from "path";

const template = "xxxxxxxx";
const letters = "abcdefghkmnopqrtufy123456789ABCDEFGHKLMNPQTFWY".split("");
const cForBG = "0123456789".split("");

const colors = [{ bg: "#ffffff", fg: "#FFFFFF00" }];

// https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Math/random#uzyskanie_losowej_liczby_mi%C4%99dzy_dwiema_warto%C5%9Bciami
const random = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min) + min);

export default async function (id: string) {
	return new Promise<string>(async (resolve, reject) => {
		const code = template
			.split("")
			.map(l =>
				l === "x"
					? letters[Math.floor(Math.random() * letters.length)]
					: l
			);
		const color = colors[Math.floor(Math.random() * colors.length)];
		const sans = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

		const image = new Jimp(code.length * 30 + 30, 50, color.bg);
		const font = new Jimp(30, 50, color.fg);

		const x = random(20, 30);

		// logger.warn(code.join(""))

		code.map((c, index) => {
			const chr = cForBG[Math.floor(Math.random() * cForBG.length)];
			font.crop(0, 0, 30, 30)
				.print(sans, 0, 0, chr)
				.rotate(random(1, random(1, 60)))
				.opacity(0.6)
				.print(sans, 0, 0, c)
				.resize(25, 25, Jimp.RESIZE_BEZIER)
				.rotate(random(1, 15))
				.resize(random(40, 45), random(40, 50), Jimp.RESIZE_HERMITE)
				.opacity(0.8)
				.dither16();
			image.composite(font, x + index * 30 - random(5, 10), random(2, 8));
		});

		image.write(
			join(__dirname, "..", "..", "images", `${id}.captcha.jpg`),
			err => {
				if (err) reject(err);
				resolve(code.join(""));
			}
		);
	});
}
