import fetch from "node-fetch";
import FormData from "form-data";
import config from "../../config";

const virustotal = config.virustotalkey;

const urlPattern =
	/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm;
const whitelist = [
	"4rdm.pl",
	"4rdm.cf",
	"bing.com",
	"twitter.com",
	"discord.gg",
	"youtube.com",
	"google.com",
	"facebook.com",
	"google.pl",
	"youtube.pl",
	"reddit.com",
	"discord.com",
	"discordapp.com",
	"help.4rdm.pl",
	"help.4rdm.cf",
	"duck.com",
	"duckduckgo.com",
	"fivem.net",
	"forum.fivem.net",
	"status.cfx.re",
];
const baseURL = "https://www.virustotal.com/api/v3/urls";
const check = (s: { result: string }) =>
	s.result == "malware" || s.result == "phishing" || s.result == "malicious"
		? true
		: false;

export const checkMessage = async (message: string): Promise<boolean> => {
	try {
		const url = urlPattern.exec(message) || [undefined];
		if (url[0] == undefined || whitelist.includes(url[0])) return false;

		const results = await fetch(baseURL, {
			method: "POST",
			headers: { "x-apikey": virustotal },
			body: (() => {
				const x = new FormData();
				x.append("url", url[0]);
				return x;
			})(),
		});
		const resultsJson = await results.json();

		const detectionResults = await fetch(
			`${baseURL}/${resultsJson.data?.id?.split("-")[1]}`,
			{ headers: { "x-apikey": virustotal } }
		);
		const detectionJson = await detectionResults.json();

		if (!detectionJson) return false;
		const detecions = detectionJson.data.attributes.last_analysis_results;

		const malwareOp = Object.keys(detecions)
			.map(key => detecions[key])
			.map(x => check(x))
			.filter(x => x == true);

		if (malwareOp.length >= 3) return true;
		else return false;
	} catch (err) {
		return false;
	}
};
