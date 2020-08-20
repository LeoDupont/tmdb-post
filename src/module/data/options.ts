/**
 * Options for posting entries to TMDb.
 */
export type PostOptions = {

	/** Set the translation of the show to work with */
	language?: string,

	/**
	 * If a similar entry already exists, update it with the provided data.
	 * Defaults to `false`.
	 */
	allowUpdate?: boolean,
};