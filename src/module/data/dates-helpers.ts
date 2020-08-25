/**
 * Simple helpers to work with dates.
 */
export module DatesHelpers {

	/** Matches three groups of figures in a string formatted as `X[X]/Y[Y]/ZZZZ`. */
	const twoTwoFourDateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

	/**
	 * Translates a short "month/day/year" date into an ISO date.
	 *
	 * Note: Solely works with strings => Does not check date validity.
	 *
	 * @param mdyyyy Short date (`M/D/YYYY`)
	 * @returns ISO date (`YYYY-MM-DD`)
	 */
	export function MDYYYYtoYYYYMMDD(mdyyyy?: string | null): string {

		const dateMatch = mdyyyy?.match(twoTwoFourDateRegex);
		if (!dateMatch || dateMatch.length < 4) {
			return '';
		}

		// (Note: dateMatch[0] is the full input string)
		const month = dateMatch[1].padStart(2, '0');
		const day = dateMatch[2].padStart(2, '0');
		const year = dateMatch[3];

		return `${year}-${month}-${day}`;
	}

	/**
	 * Translates a short "day/month/year" date into an ISO date.
	 *
	 * Note: Solely works with strings => Does not check date validity.
	 *
	 * @param mdyyyy Short date (`D/M/YYYY`)
	 * @returns ISO date (`YYYY-MM-DD`)
	 */
	export function DMYYYYtoYYYYMMDD(dmyyyy?: string | null): string {

		const dateMatch = dmyyyy?.match(twoTwoFourDateRegex);
		if (!dateMatch || dateMatch.length < 4) {
			return '';
		}

		// (Note: dateMatch[0] is the full input string)
		const day = dateMatch[1].padStart(2, '0');
		const month = dateMatch[2].padStart(2, '0');
		const year = dateMatch[3];

		return `${year}-${month}-${day}`;
	}

}