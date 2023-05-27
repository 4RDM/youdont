import { SlashCommandBuilder } from "discord.js";
import { ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
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

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	if (!interaction.isChatInputCommand()) return;

	const mention = interaction.options.getUser("mention", true);
	const response = await getUserHex(client, mention.id);

	if (!response)
		return interaction.reply({
			embeds: [ErrorEmbedInteraction(interaction, "Wystąpił błąd bazy danych")],
		});

	if (!response[0])
		return interaction.reply({
			embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono użytkownika")],
		});

	const identifiers = response.map(x => x.identifier);
	return interaction.reply(`\`\`\`Znalezione identyfikatory:\n${identifiers.join("\n")}\`\`\``);
}

export const info: CommandInfo = {
	triggers: ["hex"],
	description: "Sprawdź hex użytkownika",
	builder: new SlashCommandBuilder()
		.addUserOption(option =>
			option
				.setName("mention")
				.setDescription("Użytkownik, którego hex chcesz sprawdzić")
				.setRequired(true)
		)
		.setName("hex"),
};
