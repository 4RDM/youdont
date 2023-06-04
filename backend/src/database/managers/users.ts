import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
import { Core } from "../../core";

const prisma = new PrismaClient();

export class Users {
	constructor(private core: Core) {}

	async get(discordID: string) {
		const user = await prisma.user.findUnique({
			where: { discordID },
			include: { notatki: true, donates: true },
		});
		return user;
	}

	async create(discordID: string) {
		const document = await prisma.user.create({
			data: { discordID },
			include: { donates: true, notatki: true },
		});
		return document;
	}

	async createIfNotExists(discordID: string) {
		let user = await this.get(discordID);

		if (user) return user;
		else user = await this.create(discordID);

		return user;
	}

	async update(discordID: string, data: Partial<User>) {
		const user = await prisma.user.update({
			where: {
				discordID,
			},
			include: {
				donates: true,
				notatki: true,
			},
			data,
		});
		return user;
	}
}
