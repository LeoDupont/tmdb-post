import puppeteer from 'puppeteer';
import { Errors } from '../errors';
import { Browser } from '../browser';
import { Navigation } from './navigation';

/**
 * Manages authentication to TMDb website.
 */
export module Auth {

	export type Credentials = { username?: string, password?: string };

	/**
	 * Navigates to the TMDb login page and logs in with given credentials.
	 * @param browser Running Browser
	 * @param credentials Username and password to use
	 * @returns `true` if the authentication succeeded
	 * @throws `LoginFailed`
	 */
	export async function authenticate(browser: puppeteer.Browser, credentials: Credentials): Promise<boolean> {
		// === Go to the login page ===

		const page = await Browser.getAPage(browser, Navigation.getLoginUrl());

		// === Log in with credentials ===

		await page.type('#username', credentials.username!);
		await page.type('#password', credentials.password!);
		await page.keyboard.press('Enter');
		await page.waitForNavigation();

		// === Check that we are logged in ===

		const loggedIn = await checkIfLoggedIn(browser, page);

		// --- Get the error message ---
		if (!loggedIn) {
			let error = '';

			// Generic errors:
			let errorContainer = await page.$('.error_status.card content');
			if (!errorContainer) {
				// "Out of login attempts" error:
				errorContainer = await page.$('#main .error_wrapper h2');
			}

			if (errorContainer) {
				error = await page.evaluate(el => el.textContent, errorContainer);
			}

			throw new Errors.LoginFailed(error);
		}

		return loggedIn;
	}

	/**
	 * Checks if we are logged in TMDb.
	 * @param browser An open browser
	 * @param page Or a page already loaded to a TMDb page
	 * @returns `true` if we're logged in
	 */
	export async function checkIfLoggedIn(browser: puppeteer.Browser, page?: puppeteer.Page): Promise<boolean> {
		if (!page) {
			page = await Browser.getAPage(browser, Navigation.BASE_URL);
		}

		// Look for the User element in the header's nav bar:
		return (await page.$('header ul > li.user')) !== null;
	}

	/**
	 * Throws an error if we're not logged in.
	 * @param browser An open browser
	 * @param page Or a page already loaded to a TMDb page
	 * @throws `AuthenticationRequired` if not logged in
	 */
	export async function authGuard(browser: puppeteer.Browser, page?: puppeteer.Page) {
		if (! await Auth.checkIfLoggedIn(browser, page)) {
			throw new Errors.AuthenticationRequired();
		}
	}
}