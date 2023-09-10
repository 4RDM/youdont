import mariadb from "mariadb";
import config from "../../config";
import { Core } from "core";

// Managers
import { NotesManager } from "./notes";
import { DonatesManager } from "./donates";
import { UsersManager } from "./users";
import { PlayerDataManager } from "./playerData";
import { ArticlesManager } from "./articles";

export interface OkPacketInterface {
    affectedRows: number;
    insertId: number;
    warningStatus: number;
}

export class DatabaseCore {
    public readonly botpool;
    public readonly serverpool;

    public readonly notes;
    public readonly donates;
    public readonly users;
    public readonly playerData;
    public readonly articles;

    constructor(public readonly core: Core) {
        this.botpool = mariadb.createPool({
            ...config.mariadb,
            connectionLimit: 100,
            database: "rdmbot",
        });

        this.serverpool = mariadb.createPool({
            ...config.mysql,
            connectionLimit: 100,
            database: "rdm",
        });

        this.articles = new ArticlesManager(this);
        this.playerData = new PlayerDataManager(this);
        this.notes = new NotesManager(this);
        this.donates = new DonatesManager(this);
        this.users = new UsersManager(this);
    }
}
