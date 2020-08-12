import { Auth } from "../auth";
import { Browser } from "../browser";
import { Config } from "../../config";
import { Errors } from "../errors";

describe('AuthModule', () => {

	describe('authenticate()', () => {

		test("right credentials work", async () => {
			const browser = await Browser.launchBrowser();
			const credentials = {
				username: Config.credentials.username,
				password: Config.credentials.password,
			};

			await expect(Auth.authenticate(browser, credentials)).resolves.toBeTruthy();

			await browser.close();
		}, 30000);

		test("wrong credentials don't work", async () => {
			const browser = await Browser.launchBrowser();
			const credentials = {
				username: '~~Derp~~',
				password: 'deederp',
			};

			await expect(Auth.authenticate(browser, credentials)).rejects.toThrow(Errors.LoginFailed);

			await browser.close();
		}, 30000);

	});

});