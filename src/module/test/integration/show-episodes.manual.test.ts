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

import { TmdbPost } from "../..";
import { Episode } from "../../data/tv-show";
import { Status } from "../../data/feedback";
import { TestHelpers } from "../test-helpers";

describe('ShowEpisodes', () => {

	describe('Posting episodes', () => {

		const UNIQUE_DATA = {
			EXISTING: {
				showId: <string> '12121-nouvelle-star',
				season: <number> 9,
				episodes: <Episode[]> [
					{ number: 1 },
					{ number: 2 },
				],
				language: 'en-US',
			},
			NEW: {
				showId: <string> '12121-nouvelle-star',
				season: <number> 9,
				episodes: <Episode[]> [
					{ number: 4, name: 'Theatre Day 1', overview: '', date: '2013-01-01' },
					{ number: 5, name: 'Theatre Day 2', overview: '', date: '2013-01-08' },
				],
				language: 'en-US',
			}
		};

		let tmdb: TmdbPost;

		beforeAll(async () => {
			tmdb = await TestHelpers.initAndLogInTmdb();
		}, 30000);
		afterAll(() => {
			return tmdb.destroy();
		});

		test.skip('can ignore existing episodes', async () => {
			const feedbacks = await tmdb.postEpisodesInSeason(
				UNIQUE_DATA.EXISTING.showId,
				UNIQUE_DATA.EXISTING.season,
				UNIQUE_DATA.EXISTING.episodes,
				{ allowUpdate: false, language: UNIQUE_DATA.EXISTING.language },
				(fb) => console.log(JSON.stringify(fb))
			);

			console.log(JSON.stringify(feedbacks));
			expect(feedbacks.every(f => f.status === Status.IGNORED)).toBeTruthy();
		}, 300000);

		test.skip('can update existing episodes', async () => {
			const feedbacks = await tmdb.postEpisodesInSeason(
				UNIQUE_DATA.EXISTING.showId,
				UNIQUE_DATA.EXISTING.season,
				UNIQUE_DATA.EXISTING.episodes,
				{ allowUpdate: true, language: UNIQUE_DATA.EXISTING.language },
				(fb) => console.log(JSON.stringify(fb))
			);

			console.log(JSON.stringify(feedbacks));
			expect(feedbacks.every(f =>
				f.status === Status.UPDATED ||
				f.status === Status.IGNORED
			)).toBeTruthy();
		}, 300000);

		test.skip('can post new episodes', async () => {
			const feedbacks = await tmdb.postEpisodesInSeason(
				UNIQUE_DATA.NEW.showId,
				UNIQUE_DATA.NEW.season,
				UNIQUE_DATA.NEW.episodes,
				{ allowUpdate: false, language: UNIQUE_DATA.NEW.language },
				(fb) => console.log(JSON.stringify(fb))
			);

			console.log(JSON.stringify(feedbacks));
			expect(feedbacks.every(f => f.status === Status.ADDED)).toBeTruthy();
		}, 300000);

	});

});