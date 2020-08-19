/**
 * Simple helpers to work with dates.
 */
export module DatesHelpers {

	/** Matches three groups of figures in a string formatted as `XX/YY/ZZZZ`. */
	const twoTwoFourDateRegex = /(\d{2})\/(\d{2})\/(\d{4})/;

	/**
	 * Translates and American date into an ISO date.
	 *
	 * Note: Solely works with strings => Does not check date validity or perform any zero-padding.
	 *
	 * @param mmddyyyy American date (`MM/DD/YYYY`)
	 * @returns ISO date (`YYYY-MM-DD`)
	 */
	export function MMDDYYYYtoYYYYMMDD(mmddyyyy?: string | null): string {

		const dateMatch = mmddyyyy?.match(twoTwoFourDateRegex);
		if (!dateMatch || dateMatch.length < 4) {
			return '';
		}

		// (Note: dateMatch[0] is the full input string)
		const month = dateMatch[1];
		const day = dateMatch[2];
		const year = dateMatch[3];

		return `${year}-${month}-${day}`;
	}

}