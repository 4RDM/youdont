import { Donate } from "./donate";

export class User {
    public donates: Map<number, Donate> = new Map();

    constructor(
        public id: string,
        public total: number,
        public realTotal: number,
        public createdAt: Date
    ) {}

    addDonate(donate: Donate) {
        this.donates.set(donate.id, donate);
    }

    getDonate(id: number) {
        return this.donates.get(id);
    }

    getAllDonates() {
        return Array.from(this.donates.values());
    }
}