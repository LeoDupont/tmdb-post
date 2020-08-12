import puppeteer, { LaunchOptions } from "puppeteer";

/**
 * Helpers for launching/attaching Puppeteer browsers.
 */
export module Browser {

	type BrowserOptions = {
		/** Start a visible browser (default: `false`) */
		head?: boolean,
		/** Slow down actions by 50 milliseconds */
		slow?: boolean,
	};

	/**
	 * Launch a new Puppeteer Browser.
	 */
	export async function launchBrowser(options: BrowserOptions = {}): Promise<puppeteer.Browser> {

		const launchOptions: LaunchOptions = {
			headless: !options.head,
			slowMo: options.slow ? 50 : undefined,
		};

		return puppeteer.launch(launchOptions);
	}

	/**
	 * Attach puppeteer-core to a running browser.
	 */
	export async function attachToBrowser() {
		console.log("TODO");
	}
}