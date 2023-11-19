import { getPlayers } from "utils/serverStatus";
import { Embed } from "utils/embedBuilder";
import { SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";

export default async function ({ client, interaction }: CommandArgs) {
    const status = await getPlayers();

    // todo: store maxPlayers in settings database

    if (!status)
        interaction.Reply([ Embed({ title: ":x: | 4RDM jest offline!", color: "#f54242", user: interaction.user }) ]);
    else
        interaction.Reply([
            Embed({
                title: ":white_check_mark: | 4RDM jest online!",
                description: `**Graczy online:** ${status.length}/${client.config.maxPlayers}}`,
                color: "#1F8B4C",
                user: interaction.user,
            }),
        ]);
}

export const info: CommandInfoType = {
    name: "status",
    description: "Wyświetla status serwera",
    builder: new SlashCommandBuilder().setName("status"),
};
