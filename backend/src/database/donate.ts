export class Donate {
    constructor(
        public id: number,
        public amount: number,
        public discordID: string,
        public approved: boolean,
        public approver: string,
        public createdAt: Date,
        public countIn: boolean,
        public type: "psc" | "paypal" | "tipply"
    ) {}

    accept() {}
    deny() {}
}