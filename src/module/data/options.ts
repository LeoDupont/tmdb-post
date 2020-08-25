export enum DateLocale {
	DMY = 'DMY',
	MDY = 'MDY',
}

/**
 * Options for posting entries to TMDb.
 */
export type PostOptions = {

	/** Set the translation of the show to work with */
	translation?: string,

	/** Set the dates format (depends on the account's default locale) */
	dateLocale?: DateLocale,

	/**
	 * If a similar entry already exists, update it with the provided data.
	 * Defaults to `false`.
	 */
	allowUpdate?: boolean,

	/**
	 * Number of items that can be posted in parallel (in separate tabs).
	 * `0` and `1` mean no parallelization.
	 */
	maxParallel?: number,
};