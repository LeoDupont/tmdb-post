import puppeteer, { LaunchOptions } from 'puppeteer';
import { CredentialsManager } from '../cli/utils/credentials-manager';
import { Auth } from './auth';
import { Browser } from './browser';
import { Errors } from './errors';

/**
 * Main class of tmdb-post.
 * Acts like a black box for consumers.
 */
export class TmdbPost {

	private browser?: puppeteer.Browser;

	constructor() {}

	// =======================================================
	// == INIT/DESTROY (Browser)
	// =======================================================

	public async init(browserOptions?: LaunchOptions) {
		this.browser = await Browser.launchBrowser(browserOptions);
	}

	public async destroy() {
		return this.browser?.close();
	}

	private checkBrowser() {
		if (!this.browser) {
			throw new Errors.BrowserNotLaunched();
		}
		if (!this.browser.isConnected()) {
			throw new Errors.BrowserNotConnected();
		}
	}

	// =======================================================
	// == AUTH
	// =======================================================

	public async logIn(credentials: Auth.Credentials) {
		this.checkBrowser();
		return Auth.authenticate(this.browser!, credentials);
	}

	public async isLoggedIn() {
		this.checkBrowser();
		return Auth.checkIfLoggedIn(this.browser!);
	}

}