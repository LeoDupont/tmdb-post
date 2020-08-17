/**
 * Notes on testing this module:
 *
 * Since there is no staging TMDb environment for us and we can't delete what we post,
 * we must find TV shows and seasons and episodes that are not currently recorded
 * in TMDb to do our tests, and use a unique set of data for each successful post...
 *
 * It is advised to do tests with minimum data each time (for example, only 2 episodes at a time to test posting multiple episodes) to let underrepresented shows last longer for our tests.
 *
 * This is why this file is ignored by `npm run test`.
 * It can be run manually via `npx jest episodes`.
 *
 */

import { Episode } from "../../data/tv-show";

describe('ShowEpisodes', () => {

	describe.skip('Posting episodes', () => {

		const UNIQUE_DATA = {
			showId: <string> '',
			season: <number> 9,
			episodes: <Episode[]> [
				{ number: 1, name: 'Casting Marseille', overview: '', date: '2012-12-11' },
				{ number: 2, name: 'Casting Lyon', overview: '', date: '2012-12-18' },
			],
		};

		test('should post new episodes', async () => {
			expect(false).toBeTruthy();
		});

		test('should ignore existing episodes', async () => {
			expect(false).toBeTruthy();
		});

	});

});