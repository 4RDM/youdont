import { Core } from "../../core";
import { Notatki } from "./notatka";
import { Users } from "./users";

export class Database {
	public Users: Users;
	public Notatki: Notatki;

	constructor(private core: Core) {
		this.Users = new Users(core);
		this.Notatki = new Notatki(core);
	}
}
