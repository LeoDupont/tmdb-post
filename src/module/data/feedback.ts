import { Season, Episode } from "./tv-show";

export enum Status {
	/** The entry has been created */
	ADDED = 'added',
	/** An existing entry has been updated */
	UPDATED = 'updated',
	/** The existing entry was already up to date */
	UNCHANGED = 'unchanged',
	/** The existing entry has been ignored */
	IGNORED = 'ignored',
	/** An error occurred */
	ERROR = 'error',
}

/** A function called each time a feedback is issued */
export type FeedbackCallback = (feedback: Feedback) => void;

/**
 * Feedback on the status of a post (if it has been added, upated, ignored...).
 */
export class Feedback {

	public error?: Error;

	constructor(
		public item?: Season | Episode,
		public status?: Status,
	) {
		this.status = status || Status.UNCHANGED;
	}

	public setError(err: Error): Feedback {
		this.error = err;
		this.status = Status.ERROR;
		return this;
	}

}