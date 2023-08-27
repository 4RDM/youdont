import { SlashCommandBuilder } from "discord.js";
import { ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { Client } from "../../../main";

// prettier-ignore
export const getUserHex = async function (client: Client, discordId: string) {
	try {
		const response = await client.core.database.users.getUsersFromServer(discordId);

		return response;
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
		return interaction.Reply({
			embeds: [ErrorEmbedInteraction(interaction, "Nie znaleziono użytkownika")],
		});

	const identifiers = response.map(x => x?.identifier);
	return interaction.Reply(`\`\`\`Znalezione identyfikatory:\n${identifiers.join("\n")}\`\`\``);
}

export const info: CommandInfo = {
	triggers: ["hex"],
	description: "Sprawdź hex użytkownika",
	builder: new SlashCommandBuilder()
		.addUserOption(option => option.setName("mention").setDescription("Użytkownik, którego hex chcesz sprawdzić").setRequired(true))
		.setName("hex"),
};
