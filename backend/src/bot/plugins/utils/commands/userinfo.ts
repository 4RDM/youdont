import { Embed } from "../../../../utils/discordEmbed";
import { Command, CommandArgs } from "../../../../types";

export const execute = async function ({ message }: CommandArgs) {
	const user = message.mentions.members?.first() || message.member;
	if (!user) return;

	await user.user.fetch(true);

	const embed = Embed({
		title: user.nickname || user.user.tag,
		fields: [
			{
				name: "Nazwa",
				value: `\`${user.user.tag}\``,
				inline: true,
			},
			{
				name: "Pseudonim",
				value: `\`${user.nickname ? user.nickname : "Brak"}\``,
				inline: true,
			},
			{
				name: "ID",
				value: `\`${user.id}\``,
				inline: true,
			},
			{
				name: "Dołączył",
				value: `<t:${Math.floor(
					(user.joinedAt?.getTime() || 0) / 1000
				)}:R>`,
				inline: true,
			},
			{
				name: "Utworzył konto",
				value: `<t:${Math.floor(
					(user.user.createdAt?.getTime() || 0) / 1000
				)}:R>`,
				inline: true,
			},
			{
				name: "Booster od",
				value: `${
					// prettier-ignore
					user.premiumSince ? `<t:${Math.floor((user.premiumSince.getTime() || 0) / 1000)}:R>` : "`Brak`"
				}`,
				inline: true,
			},
		],
		image:
			user.user.bannerURL({
				forceStatic: false,
				size: 1024,
				extension: "png",
			}) || "",
		thumbnail: user.displayAvatarURL({ forceStatic: false }),
		user: message.author,
	});

	message.channel.send({ embeds: [embed] });
};

export const info: Command["info"] = {
	triggers: ["userinfo", "user"],
	description: "Sprawdź informacje na temat użytkownika",
};
