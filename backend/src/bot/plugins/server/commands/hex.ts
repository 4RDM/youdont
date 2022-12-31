import mariadb from "mariadb";
import config from "../../../../config";
import { CommandArgs } from "../../../../types";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export const execute = async function ({ client, message, args }: CommandArgs) {
	if (!args[0] || !message.mentions.users.first())
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Nie wprowadzono ID użytkownika / nie spingowano"
				),
			],
		});

	const connection = await mariadb.createConnection({
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.password,
		port: config.mysql.port,
		connectTimeout: 20000,
		database: "rdm",
	});

	const response = await connection.query(
		`SELECT * FROM kdr WHERE \`discord\` = '${
			message.mentions.users.first()?.id || args[0]
		}'`
	);

	delete response.meta;

	connection.end();

	if (!response[0])
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Nie znaleziono użytkownika")],
		});

	const identifiers = response.map((x: any) => x.identifier);
	return message.channel.send(
		`\`\`\`Znalezione identyfikatory:\n${identifiers.join("\n")}\`\`\``
	);
};

export const info = {
	triggers: ["hex"],
	description: "Sprawdź hex użytkownika",
};
