import { ErrorEmbed } from "../../../../utils/discordEmbed";
import { Client } from "../../../main";

export const getUserHex = async function (client: Client, discordId: string) {
	try {
		if (!client.Core.database.mariadb) return null;

		const connection = await client.Core.database.mariadb.getConnection();

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
	} catch (err) {
		client.logger.error(`MariaDB returned an error: ${err}`);
		return null;
	}
};

export default async function ({ client, message, args }: CommandArgs) {
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
		client,
		message.mentions.users.first()?.id ||
			args[0].replace("<@!", "").replace(">", "")
	);

	if (!response)
		return message.channel.send({
			embeds: [ErrorEmbed(message, "Wystąpił błąd bazy danych")],
		});

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
