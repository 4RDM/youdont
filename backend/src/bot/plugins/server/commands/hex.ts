import mariadb from "mariadb";
import config from "../../../../config";
import { ErrorEmbed } from "../../../../utils/discordEmbed";

export const getUserHex = async function (discordId: string) {
	const connection = await mariadb.createConnection({
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.password,
		port: config.mysql.port,
		connectTimeout: 20000,
		database: "rdm",
	});

	const response = await connection.query(
		`SELECT * FROM kdr WHERE \`discord\` = '${discordId}'`
	);

	delete response.meta;

	connection.end();

	return response as {
		identifier: string;
		kills: number;
		deaths: number;
		heady: number;
		discord: string;
		license: string;
	}[];
};

export default async function ({ message, args }: CommandArgs) {
	if (!args[0] || !message.mentions.users.first())
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Nie wprowadzono ID użytkownika / nie spingowano"
				),
			],
		});

	const response = await getUserHex(
		message.mentions.users.first()?.id ||
			args[0].replace("<@!", "").replace(">", "")
	);

	if (!response[0])
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nie znaleziono użytkownika")],
		});

	const identifiers = response.map(x => x.identifier);
	return message.channel.send(
		`\`\`\`Znalezione identyfikatory:\n${identifiers.join("\n")}\`\`\``
	);
}

export const info: CommandInfo = {
	triggers: ["hex"],
	description: "Sprawdź hex użytkownika",
};
