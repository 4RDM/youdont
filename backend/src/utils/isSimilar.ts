/* eslint-disable @typescript-eslint/no-explicit-any */
const stringSimilarity = (a: any, b: any) =>
	_stringSimilarity(prep(a), prep(b));
const _stringSimilarity = (a: any, b: any) => {
	const bg1 = bigrams(a);
	const bg2 = bigrams(b);
	const c1 = count(bg1);
	const c2 = count(bg2);
	const combined: any = uniq([...bg1, ...bg2]).reduce(
		(t: any, k: any) => t + Math.min(c1[k] || 0, c2[k] || 0),
		0
	);
	return (2 * combined) / (bg1.length + bg2.length);
};
const prep = (str: string) =>
	str
		.toLowerCase()
		.replace(/[^\w\s]/g, " ")
		.replace(/\s+/g, " ");
const bigrams = (str: any) =>
	[...str].slice(0, -1).map((c, i) => c + str[i + 1]);
const count = (xs: any) =>
	xs.reduce((a: any, x: any) => ((a[x] = (a[x] || 0) + 1), a), {});
const uniq = (xs: any) => [...new Set(xs)];

export default function (input: string, compareTo: string): boolean {
	if (stringSimilarity(input, compareTo) > 0.79) return true;
	return false;
}
