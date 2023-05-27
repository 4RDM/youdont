import { SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";

// prettier-ignore
export default async function ({ client, interaction }: CommandArgs) {
	const inter = await interaction.reply({
		embeds: [
			Embed({
				description: "**Wysyłanie**",
				user: interaction.user,
			}),
		],
	});

	client.Core.rcon("exec permisje.cfg")
		.then(() => {
			inter.edit({
				embeds: [
					Embed({
						color: "#1F8B4C",
						description: "**Wysłano!**",
						user: interaction.user,
					}),
				],
			});
		})
		.catch(() => {
			inter.edit({
				embeds: [ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia")],
			});
		});
}

export const info: CommandInfo = {
	triggers: ["refresh"],
	description: "Przeładuj uprawnienia na serwerze",
	permissions: ["Administrator"],
	role: "843444626726584370", // ZARZĄD
	builder: new SlashCommandBuilder().setName("refresh"),
};
