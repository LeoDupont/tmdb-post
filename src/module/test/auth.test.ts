import { Config } from "../../config";
import { Errors } from "../errors";
import { TmdbPost } from "../";

describe('AuthModule', () => {

	describe('authenticate()', () => {

		let tmdb: TmdbPost;

		beforeEach(async () => {
			tmdb = new TmdbPost();
			await tmdb.init();
		});

		afterEach(async () => {
			await tmdb.destroy();
		});

		test("right credentials work", async () => {
			const credentials = {
				username: Config.credentials.username,
				password: Config.credentials.password,
			};
			await expect(tmdb.logIn(credentials)).resolves.toBeTruthy();
		}, 30000);

		test("wrong credentials don't work", async () => {
			const credentials = {
				username: '~~Derp~~',
				password: 'deederp',
			};
			await expect(tmdb.logIn(credentials)).rejects.toThrow(Errors.LoginFailed);
		}, 30000);

	});

});