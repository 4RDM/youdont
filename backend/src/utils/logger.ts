/* eslint-disable @typescript-eslint/no-explicit-any */
export const gT = (): string =>
    `${("0" + new Date().getHours()).slice(-2)}:${(
        "0" + new Date().getMinutes()
    ).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)}`;

export const cT = (m: any): any => m.join("\t");

export default {
    error: (...message: any): void =>
        console.error(`\x1b[31mERROR\x1b[m [\x1b[90m${gT()}\x1b[m] | ${cT(message)}`),
    ready: (...message: any): void =>
        console.log(`\x1b[92mREADY\x1b[m [\x1b[90m${gT()}\x1b[m] | ${cT(message)}`),
    log: (...message: any): void =>
        console.log(`\x1b[36mLOG\x1b[m   [\x1b[90m${gT()}\x1b[m] | ${cT(message)}`),
    warn: (...message: any): void =>
        console.warn(`\x1b[93mWARN\x1b[m  [\x1b[90m${gT()}\x1b[m] | ${cT(message)}`),
};