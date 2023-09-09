import { SlashCommandBuilder } from "discord.js";
import { Embed } from "../../../../utils/discordEmbed";

export default async function ({ client, interaction }: CommandArgs) {
    const embed = Embed({
        title: "Ping bota",
        description: `\`\`\`API: ${Math.floor(client.ws.ping)}ms\nWiadomość: ${Date.now() - interaction.createdTimestamp}ms\`\`\``,
        user: interaction.user,
    });

    interaction.Reply({ embeds: [embed] });
}

export const info: CommandInfo = {
    triggers: ["ping"],
    description: "Sprawdź opóźnienie API bota",
    builder: new SlashCommandBuilder().setName("ping"),
};
