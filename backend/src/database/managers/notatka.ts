import { PrismaClient } from "@prisma/client";
import { Core } from "../../core";

const prisma = new PrismaClient();

export class Notatki {
	constructor(private core: Core) {}

	async get(discordID: string) {
		const user = await prisma.notatka.findMany({ where: { discordID } });
		return user;
	}

	async create({
		discordID,
		content,
		createdAt,
	}: {
		discordID: string;
		content: string;
		createdAt?: Date;
	}) {
		const lastDocument = (await prisma.notatka.findFirst({
			where: { discordID },
			orderBy: { notatkaID: "desc" },
		})) || { notatkaID: 0 };

		const document = await prisma.notatka.create({
			data: {
				discordID,
				content,
				createdAt: createdAt || new Date(),
				notatkaID: lastDocument.notatkaID + 1,
			},
		});
		return document;
	}

	async delete(discordID: string, notatkaID: number) {
		const user = await this.get(discordID);
		if (!user) return;

		const notatka = user.find(n => n.notatkaID === notatkaID);
		if (!notatka) return;

		const document = await prisma.notatka.delete({
			where: { id: notatka.id },
		});

		return document;
	}
}
