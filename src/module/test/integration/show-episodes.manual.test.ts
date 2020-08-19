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
import { TmdbPost } from "../..";
import { TestHelpers } from "../test-helpers";

describe('ShowEpisodes', () => {

	describe('Posting episodes', () => {

		const UNIQUE_DATA = {
			EXISTING: {
				showId: <string> '12121-nouvelle-star',
				season: <number> 9,
				episodes: <Episode[]> [
					{ number: 1, overview: ' ' },
					{ number: 2, overview: ' ' },
				],
			},
			NEW: {
				showId: <string> '12121-nouvelle-star',
				season: <number> 9,
				episodes: <Episode[]> [
					// { number: 1, name: 'Casting Marseille', overview: '', date: '2012-12-11' },
					{ number: 2, name: 'Casting Lyon', overview: 'Second casting', date: '2012-12-18' },
					{ number: 3, name: 'Casting Paris', overview: '', date: '2012-12-25' },
				],
			}
		};

		let tmdb: TmdbPost;

		beforeAll(async () => {
			tmdb = await TestHelpers.initAndLogInTmdb();
		}, 30000);
		afterAll(() => {
			return tmdb.destroy();
		}, 30000);

		test.skip('can ignore existing episodes', async () => {
			const added = await tmdb.postEpisodesInSeason(
				UNIQUE_DATA.EXISTING.showId,
				UNIQUE_DATA.EXISTING.season,
				UNIQUE_DATA.EXISTING.episodes,
				false
			);
			expect(added).toBeTruthy();
		}, 30000);

		test.skip('can update existing episodes', async () => {
			const added = await tmdb.postEpisodesInSeason(
				UNIQUE_DATA.EXISTING.showId,
				UNIQUE_DATA.EXISTING.season,
				UNIQUE_DATA.EXISTING.episodes,
				true
			);
			expect(added).toBeTruthy();
		}, 30000);

		test.skip('can post new episodes', async () => {
			const added = await tmdb.postEpisodesInSeason(
				UNIQUE_DATA.NEW.showId,
				UNIQUE_DATA.NEW.season,
				UNIQUE_DATA.NEW.episodes,
				false
			);
			expect(added).toBeTruthy();
		}, 30000);


	});

});