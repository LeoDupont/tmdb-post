export type Season = {
	showId?: string,

	number: number,
	name?: string,
	overview?: string,
};

export type Episode = {
	showId?: string,
	season?: number,

	number: number,
	name: string,
	overview: string,

	/** Air date (`YYYY-MM-DD` format) */
	date: string,
};