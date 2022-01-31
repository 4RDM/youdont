import { Embed, ErrorEmbed } from "../../../../utils/discordEmbed"
import { Command } from "../../../../types"

const command: Command = {
	triggers: ["ban"],
	description: "Zbanuj osobę",
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
			})
		const mention = message.mentions.members?.first()
		const reason = args.join(" ").replace(args[0], "").replace(" ", "")
		if (!mention) {
			if (
				(args[0] == "594526434526101527" &&
					message.author.id !== "364056796932997121") ||
				(args[0] == "364056796932997121" &&
					message.author.id !== "594526434526101527")
			)
				return message.react("🖕")
			await message.guild?.members
				.ban(args[0], { reason: reason ? reason : "", days: 7 })
				.then((user: any) => {
					message.channel.send({
						embeds: [
							Embed({
								title: ":hammer: Banhammer",
								color: "#1F8B4C",
								description: `Zbanowany: \`${
									user.username || user.id || user
								}\` (\`${args[0]}\`)\nModerator: \`${
									message.author.tag
								}\` (\`${message.author.id}\`)\nPowód: \`${
									reason || "Brak"
								}\``,
								user: message.author,
							}),
						],
					})
				})
				.catch(() =>
					message.channel.send({
						embeds: [
							ErrorEmbed({
								reason: "Nie udało się zbanować tego użytkownika!",
								user: message.author,
							}),
						],
					})
				)
			return
		} else {
			if (!mention.bannable)
				return message.channel.send({
					embeds: [
						ErrorEmbed({
							reason: "Nie można zbanować tego użytkownika",
							user: message.author,
						}),
					],
				})
			if (
				(mention.id == "594526434526101527" &&
					message.author.id !== "364056796932997121") ||
				(mention.id == "364056796932997121" &&
					message.author.id !== "594526434526101527")
			)
				return message.react("🖕")
			await mention
				.ban({ reason: reason ? reason : "", days: 7 })
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
					})
				})
				.catch(() =>
					message.channel.send({
						embeds: [
							ErrorEmbed({
								reason: `Prawidłowe użycie: .${this.triggers[0]} <użytkownik> [powód]`,
								user: message.author,
							}),
						],
					})
				)
		}
	},
}

module.exports = command
