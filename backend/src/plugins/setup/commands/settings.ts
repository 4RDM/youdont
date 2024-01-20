import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { AutocompleteArgs, CommandArgs, CommandInfoType } from "handlers/commands";
import { embedColors } from "utils/constants";
import { Embed } from "utils/embedBuilder";

interface functionArgs {
    option: string | null
    value: string | null
    reset: boolean | null
    interaction: CommandArgs["interaction"]
    client: CommandArgs["client"]
}

const showAllSettings = async (args: functionArgs) => {
    const settings = await args.client.database.config.getAll();

    if (!settings)
        return await args.interaction.Error("Nie udało się pobrać ustawień serwera!", { ephemeral: true });

    const embed = Embed({
        title: "<:coin:1173353006113239080> | Ustawienia serwera",
        description: "Lista wszystkich ustawień serwera",
        fields: settings.map(setting =>
            ({
                name: setting.dKey,
                value: `\`${setting.dValue}\``,
                inline: true
            })
        ),
        user: args.interaction.user
    });

    return await args.interaction.Reply([ embed ]);
};

const showSetting = async (args: functionArgs) => {
    if (!args.option || args.option.length > 100)
        return await args.interaction.Error("Nieprawidłowe dane, klucz nie może być dłuższy niż 100 znaków!", { ephemeral: true });

    const setting = await args.client.database.config.get(args.option as string);

    if (setting === false)
        return await args.interaction.Error("Nie udało się pobrać ustawienia serwera!", { ephemeral: true });

    if (setting === null)
        return await args.interaction.Error("Nie znaleziono ustawienia!", { ephemeral: true });

    const embed = Embed({
        title: "<:coin:1173353006113239080> | Ustawienie serwera",
        fields: [
            {
                name: args.option as string,
                value: `\`${setting}\``,
                inline: true
            }
        ],
        color: embedColors.blue,
        user: args.interaction.user
    });

    return await args.interaction.Reply([ embed ]);
};

const setSetting = async (args: functionArgs) => {
    if (!args.option || !args.value || args.option.length > 100 || args.value.length < 1)
        return await args.interaction.Error("Nieprawidłowe dane, klucz nie może być dłuższy niż 100 znaków!", { ephemeral: true });

    const setting = await args.client.database.config.set(args.option, args.value);

    if (setting === false)
        return await args.interaction.Error("Nie udało się ustawić ustawienia serwera!", { ephemeral: true });

    if (setting === -1)
        return await args.interaction.Error("Klucz jest dłuższy niż 100 znaków!", { ephemeral: true });

    const embed = Embed({
        title: "<:coin:1173353006113239080> | Ustawienie serwera",
        description: `Ustawiono \`${args.option}\` na \`${args.value}\``,
        color: embedColors.green,
        user: args.interaction.user
    });

    return await args.interaction.Reply([ embed ]);
};

const resetSetting = async (args: functionArgs) => {
    if (!args.option || args.option.length > 100)
        return await args.interaction.Error("Nieprawidłowe dane, klucz nie może być dłuższy niż 100 znaków!", { ephemeral: true });

    const setting = await args.client.database.config.reset(args.option);

    if (setting === false)
        return await args.interaction.Error("Nie udało się ustawić ustawienia serwera!", { ephemeral: true });

    const embed = Embed({
        title: "<:coin:1173353006113239080> | Ustawienie serwera",
        description: `Zresetowano \`${args.option}\``,
        color: embedColors.green,
        user: args.interaction.user
    });

    return await args.interaction.Reply([ embed ]);
};

export default async function ({ interaction, client }: CommandArgs) {
    if (!interaction.guild)
        return interaction.Error("To polecenie można wykonać tylko na serwerze!", { ephemeral: true});

    const option = interaction.options.get("option", false)?.value as string | null;
    const value = interaction.options.get("value", false)?.value as string | null;
    const reset = interaction.options.get("reset", false)?.value as boolean | null;

    if (!option)
        return await showAllSettings({ option, value, reset, interaction, client });
    if (option && reset)
        return await resetSetting({ option, value, reset, interaction, client });
    if (option && !value && !reset)
        return await showSetting({ option, value, reset, interaction, client });
    if (option && value && !reset)
        return await setSetting({ option, value, reset, interaction, client });
}

export async function autocomplete({ interaction, client }: AutocompleteArgs) {
    if (!interaction.isAutocomplete()) return;

    const focused = interaction.options.getFocused(true);

    switch (focused.name) {
        case "option": {
            const choices = await client.database.config.getAll();

            if (choices === false)
                return await interaction.respond([]);

            const filtered = choices.filter(choice => choice.dKey.startsWith(focused.value));

            await interaction.respond(filtered.map(choice => ({ name: choice.dKey, value: choice.dKey })));

            break;
        }
        default: {
            await interaction.respond([]);

            break;
        }
    }
}

export const info: CommandInfoType = {
    name: "settings",
    description: "Settings for this server",
    permissions: PermissionFlagsBits.Administrator,
    builder: new SlashCommandBuilder()
        .addStringOption(option => option.setName("option").setDescription("Option to interact with").setRequired(false).setAutocomplete(true))
        .addStringOption(option => option.setName("value").setDescription("Value to change to").setRequired(false))
        .addBooleanOption(option => option.setName("reset").setDescription("Reset to default").setRequired(false))
        .setName("settings"),
};