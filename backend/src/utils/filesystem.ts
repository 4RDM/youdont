import { readFileSync, writeFileSync } from "fs";
import { parse, resolve as res } from "path";

export const addFile = (str: string, path: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			const content = readFileSync(res(path), { encoding: "utf-8" });
			writeFileSync(path, Buffer.from(`${content.toString()}\n${str}`), {
				encoding: "utf-8",
			});
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};
