import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { GuildMember, User } from "discord.js";

export const execute = async function ({ message, args }: CommandArgs) {
	if (!args[0])
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Prawidłowe użycie: `.ban <użytkownik> [powód]`"
				),
			],
		});

	const mention = message.mentions.members?.first();
	const reason = args.join(" ").replace(args[0], "").replace(" ", "");
	if (!mention) {
		if (
			(args[0] == "594526434526101527" &&
				message.author.id !== "364056796932997121") ||
			(args[0] == "364056796932997121" &&
				message.author.id !== "594526434526101527")
		)
			return message.react("🖕");
		await message.guild?.members
			.ban(args[0], {
				reason: reason ? reason : "",
				deleteMessageSeconds: 7 * 24 * 60 * 60,
			})
			.then((user: User | string | GuildMember) => {
				message.channel.send({
					embeds: [
						Embed({
							title: ":hammer: Banhammer",
							color: "#1F8B4C",
							description: `Zbanowany: \`${
								typeof user !== "string" ? user.id : user
							}\` (\`${args[0]}\`)\nModerator: \`${
								message.author.tag
							}\` (\`${message.author.id}\`)\nPowód: \`${
								reason || "Brak"
							}\``,
							user: message.author,
						}),
					],
				});
			})
			.catch(() => {
				message.channel.send({
					embeds: [
						ErrorEmbed(
							message,
							"Nie udało się zbanować tego użytkownika!"
						),
					],
				});
			});
		return;
	} else {
		if (!mention.bannable)
			return message.channel.send({
				embeds: [
					ErrorEmbed(message, "Nie można zbanować tego użytkownika!"),
				],
			});
		if (
			(mention.id == "594526434526101527" &&
				message.author.id !== "364056796932997121") ||
			(mention.id == "364056796932997121" &&
				message.author.id !== "594526434526101527")
		)
			return message.react("🖕");
		await mention
			.ban({
				reason: reason ? reason : "",
				deleteMessageSeconds: 7 * 24 * 60 * 60,
			})
			.then(() => {
				message.channel.send({
					embeds: [
						Embed({
							title: ":hammer: Banhammer",
							color: "#1F8B4C",
							description: `Zbanowany: \`${
								mention.user.tag
							}\` (\`${mention.id}\`)\nModerator: \`${
								message.author.tag
							}\` (\`${message.author.id}\`)\nPowód: \`${
								reason || "Brak"
							}\``,
							user: message.author,
						}),
					],
				});
			})
			.catch(() => {
				message.channel.send({
					embeds: [
						ErrorEmbed(
							message,
							"Prawidłowe użycie: `.ban <użytkownik> [powód]`"
						),
					],
				});
			});
	}
};

export const info: CommandInfo = {
	triggers: ["ban"],
	description: "Zbanuj osobę",
	permissions: ["BanMembers", "KickMembers"],
};
