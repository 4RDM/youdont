import { SlashCommandBuilder } from "discord.js";
import { Embed } from "utils/embedBuilder";
import { Roles as Rl } from "utils/constants";
import { AutocompleteArgs, CommandArgs, CommandInfoType } from "handlers/commands";
import logger from "utils/logger";

export default async function ({ interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;

    if (!interaction.channel)
        return await interaction.Error("Polecenie dostępne jedynie na kanale!", { ephemeral: true });

    const channel = await interaction.channel.fetch(true);

    if (!channel.isTextBased() || channel.isDMBased())
        return await interaction.Error("Nie można użyć tego polecenia na tym kanale!", { ephemeral: true });

    if (!channel.name.startsWith("ticket"))
        return await interaction.Error("Nie można użyć tego polecenia poza ticketami!", { ephemeral: true });

    const status = interaction.options.getString("status", true);
    const channelName = channel.name.split("-").splice(0, 2);

    channel.setName(`${channelName.join("-")}-${status.split(" ").join("-")}`)
        .then(() => {
            interaction.Reply([ Embed({ color: "#1F8B4C", title: ":white_check_mark: | Zmieniono status ticketa", user: interaction.user }) ]);
        }).catch((err) => {
            interaction.Error("Wystąpił błąd, sprawdź konsolę!", { ephemeral: true });
            logger.error(err);
        });
}

export async function autocomplete({ interaction }: AutocompleteArgs) {
    if (!interaction.isAutocomplete()) return;

    const response = [
        {
            name: "gotowe",
            value: "done"
        },
        {
            name: "do wgrania",
            value: "upld"
        },
        {
            name: "trwa praca",
            value: "work"
        },
        {
            name: "czeka na realizacje",
            value: "wait"
        }
    ];

    await interaction.respond(response);
}

export const info: CommandInfoType = {
    name: "rename",
    description: "Zmienia status ticketa",
    role: [ ...Rl.DeveloperTeam,  Rl.HeadAdmin, Rl.SeniorAdmin, Rl.Admin,Rl.TrialDeveloper ],
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("status").setDescription("Status ticketa").setAutocomplete(true).setRequired(true))
        .setName("rename"),
};
