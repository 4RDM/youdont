import { Collection, Role } from "discord.js";

export interface AdministratorRole {
	name: string
	rarity: number
	id: string
}

export const RolesObject = [
	{
		name: "Właściciel",
		rarity: 10,
		id: "876529651919519794",
	},
	{
		name: "Zarząd",
		rarity: 9,
		id: "843444626726584370",
	},
	{
		name: "Head Admin",
		rarity: 8,
		id: "843444636793176064",
	},
	{
		name: "Admin",
		rarity: 7,
		id: "843444637565321236",
	},
	{
		name: "Developer",
		rarity: 6,
		id: "883475949964906516",
	},
	{
		name: "Community Moderator",
		rarity: 5,
		id: "923243118860570674",
	},
	{
		name: "Moderator",
		rarity: 4,
		id: "843444638219370497",
	},
	{
		name: "Support",
		rarity: 3,
		id: "843444639666143252",
	},
	{
		name: "Trial Developer",
		rarity: 2,
		id: "863107202365390879",
	},
	{
		name: "Trial Support",
		rarity: 1,
		id: "843444639997886465",
	},
];

export const getHighestRole = (
	roles: Collection<string, Role>
): AdministratorRole => {
	let highest: AdministratorRole | undefined = undefined;
	roles.forEach(role => {
		const role2 = RolesObject.find(x => x?.id === role.id);
		if (role2 && role2.rarity > (highest?.rarity || 0)) highest = role2;
	});
	return highest || { name: "Członek", id: "", rarity: 0 };
};
