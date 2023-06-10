import { Response } from "express";

// prettier-ignore
const send = (res: Response, code: number, message: string, ...args: string[]) =>
	res.status(code).setHeader("Cache-Control", "no-cache").json({ code, message, ...args }) && false;

// prettier-ignore
export const unauthorized = (res: Response, ...message: string[]) =>
	send(res, 401, "Unauthorized request. Check if you're logged in, if 'authorization' header is providen or if you have permissions to perform this action.", ...message);

// prettier-ignore
export const notFound = (res: Response, ...message: string[]) =>
	send(res, 404, "Not Found", ...message);

// prettier-ignore
export const badRequest = (res: Response,...message: string[]) =>
	send(res, 400, "Bad Request", ...message);

// prettier-ignore
export const internalError = (res: Response, ...message: string[]) =>
	send(res, 500, "Internal server error, please contact with site administrator", ...message);
