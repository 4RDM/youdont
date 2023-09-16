import { Interaction } from "discord.js";

export const handleInteraction = (interaction: Interaction) => {
    if (!interaction.inGuild()) return;


};