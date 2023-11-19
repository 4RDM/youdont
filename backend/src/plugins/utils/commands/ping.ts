import { SlashCommandBuilder } from "discord.js";
import { Embed } from "utils/embedBuilder";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ client, interaction }: CommandArgs) {
    const embed = Embed({
        title: "Ping bota",
        fields: [
            {
                name: ":robot: API",
                value: `${Math.floor(client.ws.ping)}ms`,
                inline: true
            },
            {
                name: ":incoming_envelope: Wiadomość",
                value: `\`${Date.now() - interaction.createdTimestamp}ms\``,
                inline: true
            },
        ],
        user: interaction.user,
    });

    interaction.Reply([ embed ]);
}

export const info: CommandInfoType = {
    name: "ping",
    description: "Sprawdź opóźnienie API bota",
    builder: new SlashCommandBuilder().setName("ping"),
};
