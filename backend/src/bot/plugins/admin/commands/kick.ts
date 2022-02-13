import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed";
import { Command } from "../../../../types";

const command: Command = {
	triggers: ["kick"],
	description: "Wyrzuć osobę",
	permissions: ["BAN_MEMBERS", "KICK_MEMBERS"],
	async exec(client, message, args) {
		if (!args[0])
			return message.channel.send({
				embeds: [
					ErrorEmbed({
						reason: `Prawidłowe użycie: .${this.triggers[0]} <użytkownik> [powód]`,
						user: message.author,
					}),
				],
			});
		const mention = message.mentions.members?.first();
		const reason = args.join(" ").replace(args[0], "").replace(" ", "");
		if (!mention)
			return message.channel.send({
				embeds: [
					ErrorEmbed({
						reason: `Prawidłowe użycie: .${this.triggers[0]} <użytkownik> [powód]`,
						user: message.author,
					}),
				],
			});
		else {
			if (!mention.kickable)
				return message.channel.send({
					embeds: [
						ErrorEmbed({
							reason: "Nie można wyrzucić tego użytkownika",
							user: message.author,
						}),
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
				.catch(() =>
					message.channel.send({
						embeds: [
							ErrorEmbed({
								reason: "Nie udało się wyrzucić tego użytkownika!",
								user: message.author,
							}),
						],
					})
				);
		}
	},
};

module.exports = command;
