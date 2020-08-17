/**
 * Notes on testing this module:
 *
 * Since there is no staging TMDb environment for us and we can't delete what we post,
 * we must find TV shows and seasons and episodes that are not currently recorded
 * in TMDb to do our tests, and use a unique set of data for each successful test...
 *
 * It is advised to do tests with minimum data each time (for example, only 2 episodes at a time to test posting multiple episodes) to let underrepresented shows last longer for our tests.
 *
 * This is why this file is ignored by `npm run test`.
 * It can be run manually via `npx jest tv-shows.manual`.
 *
 */

import { Episode, Season } from "../../data/tv-show";
import { TestHelpers } from "../test-helpers";
import { TmdbPost } from "../../tmdb-post";

describe('TvShows', () => {

	// =======================================================
	// == SEASONS
	// =======================================================

	describe('Posting seasons', () => {

		const UNIQUE_DATA = {
			showID: <string> '12121-nouvelle-star',
			existingSeason: <Season> { number: 9, name: 'Season 9' },
			newSeason: <Season> { number: 9, name: undefined, overview: undefined },
		};

		let tmdb: TmdbPost;

		beforeAll(async () => {
			tmdb = await TestHelpers.initAndLogInTmdb();
		}, 30000);
		afterAll(async () => {
			await tmdb.destroy();
		}, 30000);

		test('can ignore an existing season', async () => {
			const added = await tmdb.postSeason(UNIQUE_DATA.showID, UNIQUE_DATA.existingSeason, false);
			expect(added).toBeTruthy();
		}, 30000);

		// test('can update an existing season', async () => {
		// 	const added = await tmdb.postSeason(UNIQUE_DATA.showID, UNIQUE_DATA.existingSeason, true);
		// 	expect(added).toBeTruthy();
		// });

		test('can post a new season', async () => {
			const added = await tmdb.postSeason(UNIQUE_DATA.showID, UNIQUE_DATA.newSeason, false);
			expect(added).toBeTruthy();
		}, 30000);

	});

	// =======================================================
	// == EPISODES
	// =======================================================

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