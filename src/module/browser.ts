import puppeteer, { LaunchOptions } from "puppeteer";

/**
 * Helpers for launching/attaching Puppeteer browsers.
 */
export module Browser {

	// =======================================================
	// == GETTING A BROWSER
	// =======================================================

	/**
	 * Launch a new Puppeteer Browser.
	 */
	export async function launchBrowser(options: LaunchOptions = {}): Promise<puppeteer.Browser> {
		return puppeteer.launch(options);
	}

	/**
	 * Attach puppeteer-core to a running Chromium-based browser.
	 *
	 * **Note**: the instance to connect to should be launched with `remote-debugging-port=9229`.
	 */
	export async function attachToBrowser(webSocketDebuggerUrl: string, options: LaunchOptions = {}) {
		return puppeteer.connect({
			...options,
			browserWSEndpoint: webSocketDebuggerUrl
		});
	}

	// =======================================================
	// == GETTING PAGES
	// =======================================================

	/**
	 * Returns an already open page or a freshly created one.
	 * @param browser An open browser
	 * @param url The beginning of the URL we want our page to be
	 * @param exactUrl `true` to get a page at the exact `url` (and not only starting with it)
	 */
	export async function getAPage(browser: puppeteer.Browser, url?: string, exactUrl?: boolean): Promise<puppeteer.Page> {

		console.log('getting a page to', url);

		let thePage: puppeteer.Page | undefined;

		// === Choose a page ===

		const pages = await browser.pages();
		console.log('open pages:', pages.map(p => p.url()));
		if (pages.length > 0) {

			if (url) {

				// --- On the right domain ---

				const blankPages = [];
				for (const page of pages) {

					// Return the first page that is on the right domain:
					if (
						( !exactUrl && page.url().startsWith(url) ) ||
						( page.url() === url )
					) {
						console.log('found an already open page to', page.url());
						return page;
					}
					console.log('no page found...');

					// Save blank page for eventual use:
					if (page.url() === 'about:blank') {
						blankPages.push(page);
					}
				}

				// Use a blank page to go to desired location:
				if (blankPages.length > 0) {
					thePage = blankPages[0];
				}
				// else: we'll create a new page...
			}
			else {

				// --- On any domain ---

				return pages[0];
			}
		}

		// === Create a new page ===

		if (!thePage) {
			thePage = await browser.newPage();
		}

		if (url) {
			// On the right domain:
			await thePage.goto(url);
		}

		return thePage;
	}
}
