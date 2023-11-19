import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandArgs, CommandInfoType } from "handlers/commands";
import { Roles } from "utils/constants";
import { Embed } from "utils/embedBuilder";

export default async function ({ client, interaction }: CommandArgs) {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return;

    const guild = await client.guilds.fetch(interaction.guildId);
    const mention = interaction.options.getUser("mention", true);
    const user = await guild.members.fetch(mention.id).catch(() => null);

    if (!user)
        return await interaction.Error("Nie znaleziono użytkownika!", { ephemeral: true });

    user.roles.remove("932345054142529538");
    user.roles.remove("1019319109932032011");

    const embed = Embed({
        title: ":x: | Usunięto houndsa!",
        color: "#f54242",
        user: interaction.user
    });

    interaction.Reply([ embed ]);
}

export const info: CommandInfoType = {
    name: "usunhoundsa",
    description: "Usuń hounds",
    permissions: PermissionFlagsBits.Administrator,
    role: [ Roles.Owner, Roles.Zarzad, Roles.HeadAdmin, Roles.OpiekunHounds ],
    builder: new SlashCommandBuilder()
        .addUserOption(option => option.setName("mention").setDescription("Użytkownik").setRequired(true))
        .setName("usunhoundsa"),
};
