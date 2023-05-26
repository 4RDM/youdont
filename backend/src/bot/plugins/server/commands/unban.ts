import { SlashCommandBuilder } from "discord.js";
import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";

export default async function ({ client, message, args }: CommandArgs) {
	if (!args[0])
		return message.channel.send({
			embeds: [
				ErrorEmbed(message, "Prawidłowe użycie: `.unban <id-bana>`"),
			],
		});

	const msg = await message.channel.send({
		embeds: [
			Embed({
				description: "**Wysyłanie**",
				user: message.author,
			}),
		],
	});

	client.Core.rcon(args.join(`unban ${parseInt(args[0])}`))
		.then(() => {
			msg.edit({
				embeds: [
					Embed({
						color: "#1F8B4C",
						description: "**Wysłano!**",
						user: message.author,
					}),
				],
			});
		})
		.then(() => {
			msg.edit({
				embeds: [ErrorEmbed(message, "Nie udało się wysłać polecenia")],
			});
		});
}

export const info: CommandInfo = {
	triggers: ["unban"],
	description: "Odbanuj osobę na serwerze",
	permissions: ["Administrator"],
	role: "843444642539110400", // TEAM 4RDM
	builder: new SlashCommandBuilder()
		.addIntegerOption(option =>
			option
				.setName("id")
				.setDescription("ID bana do odbanowania")
				.setRequired(true)
		)
		.setName("unban"),
};
