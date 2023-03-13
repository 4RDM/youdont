import { Response } from "express";

const send = (res: Response, code: number, message: string) =>
	res
		.status(code)
		.setHeader("Cache-Control", "no-cache")
		.json({ code, message }) && false;

export const unauthorized = (res: Response) =>
	send(
		res,
		401,
		"Unauthorized request. Check if you're logged in, if 'authorization' header is providen or if you have permissions to perform this action."
	);

export const notFound = (res: Response) => send(res, 404, "Not Found");

export const badRequest = (res: Response, message: string) =>
	send(res, 400, message);

export const internalError = (res: Response) =>
	send(
		res,
		500,
		"Internal server error, please contact with domain administrator"
	);
