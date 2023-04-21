import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { Command, CommandArgs } from "../../../../types";

export const execute = async function ({ message, args }: CommandArgs) {
	if (!args[0])
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Prawidłowe użycie: `.kick <użytkownik> [powód]`"
				),
			],
		});

	const mention = message.mentions.members?.first();
	const reason = args.join(" ").replace(args[0], "").replace(" ", "");
	if (!mention)
		return message.channel.send({
			embeds: [
				ErrorEmbed(
					message,
					"Prawidłowe użycie: `.kick <użytkownik> [powód]`"
				),
			],
		});
	else {
		if (!mention.kickable)
			return message.channel.send({
				embeds: [
					ErrorEmbed(
						message,
						"Nie udało się wyrzucić tego użytkownika!"
					),
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
			.kick(reason ? reason : "")
			.then(() => {
				message.channel.send({
					embeds: [
						Embed({
							title: ":hammer: | Pomyślnie wyrzucono",
							color: "#1F8B4C",
							description: `Wyrzucony: \`${
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
							"Nie udało się wyrzucić tego użytkownika!"
						),
					],
				});
			});
	}
};

export const info: Command["info"] = {
	triggers: ["kick"],
	description: "Wyrzuć osobę",
	permissions: ["BanMembers", "KickMembers"],
};
