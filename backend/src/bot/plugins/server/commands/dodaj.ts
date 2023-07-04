import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbedInteraction } from "../../../../utils/discordEmbed";
import { addFile } from "../../../../utils/filesystem";
import { hexToDec } from "../../../../utils/strings";
import { join } from "path";
import { existsSync } from "fs";
import { Roles } from "../../../constants";

const path = join("/home/rdm/server/data/permisje.cfg");

// prettier-ignore
export default async function ({ interaction, client }: CommandArgs) {
	if (!existsSync(path))
		return interaction.Reply({ embeds: [ErrorEmbedInteraction(interaction, "Funkcja niedostępna na tym komputerze!")] });

	if (!interaction.isChatInputCommand()) return;

	const mention = interaction.options.getUser("mention", true);
	const hex = interaction.options.getString("hex", true);
	const role = interaction.options.getString("role", true);

	const interactionReply = await interaction.Reply({
		embeds: [
			Embed({
				description: "**Wysyłanie**",
				user: interaction.user,
			}),
		],
	});

	if (!interactionReply) return;
	
	addFile(`add_principal identifier.steam:${hex} group.${role} # ${mention.tag} (${mention.id}) https://steamcommunity.com/profiles/${hexToDec(hex)} ${new Date().toLocaleDateString()}`, path)
		.then(() => {
			interactionReply.edit({
				embeds: [
					Embed({
						color: "#1F8B4C",
						description: "**Wysłano!**",
						user: interaction.user,
					}),
				],
			});

			client.core.rcon("exec permisje.cfg");
			client.core.rcon("refreshAllW0");
		})
		.catch(() => {
			interactionReply.edit({
				embeds: [ErrorEmbedInteraction(interaction, "Nie udało się wysłać polecenia")],
			});
		});
}

export const info: CommandInfo = {
	triggers: ["dodaj"],
	description: "Dodaj użytkownika do konfiguracji",
	permissions: PermissionFlagsBits.Administrator,
	role: Roles.Dodaj,
	builder: new SlashCommandBuilder()
		.addStringOption(option =>
			option
				.setName("hex")
				.setDescription("SteamID w hex")
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName("role").setDescription("Ranga").setRequired(true)
		)
		.addUserOption(option =>
			option
				.setName("mention")
				.setDescription("Użytkownik")
				.setRequired(true)
		)
		.setName("dodaj"),
};
