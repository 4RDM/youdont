import { Database } from "./database";

export class User {
    constructor(
        public id: string,
        public createdAt: Date
    ) {}
}

export class UserManager {
    private user: Map<string, User> = new Map();

    constructor(private database: Database) {}

    async getConnection() {
        return await this.database.getBotConnection();
    }

    async create(id: string, createdAt: Date) {
        this.user.set(id, new User(id, createdAt));
    }

    async get(id: string) {
        return this.user.get(id);
    }
}