import puppeteer from 'puppeteer';
import { Browser } from "../browser";
import { Config } from "../../config";

describe('Browser', () => {

	describe('launchBrowser()', () => {

		test('should open a fresh new browser', async () => {
			const browser = await Browser.launchBrowser();
			expect(browser.isConnected()).toBeTruthy();
			await browser.close();
		}, 30000);

		// test('should open installed browser with user profile', async () => {
		// 	const browser = await Browser.launchBrowser({
		// 		headless: false,
		// 		executablePath: Config.browsers.EXECUTABLE_PATH,
		// 		userDataDir: Config.browsers.PROFILE_DIR,
		// 	});

		// 	expect(browser.isConnected()).toBeTruthy();
		// 	await browser.disconnect();
		// }, 30000);

	});

	describe('attachBrowser()', () => {

		test('should attach to open browser', async () => {
			const browser = await Browser.attachToBrowser(Config.browsers.WS_DEBUGGER_URL);
			expect(browser.isConnected()).toBeTruthy();
			await browser.disconnect();
		});

	});

	describe('getAPage()', () => {

		const githubUrl = 'https://github.com/';
		const githubExploreUrl = 'https://github.com/explore';
		let browser: puppeteer.Browser;
		let githubExplorePage: puppeteer.Page;

		beforeAll(async () => {
			browser = await Browser.launchBrowser();
		});
		afterAll(async () => {
			await browser.close();
		});

		test('1. get a new page on GitHub Explore', async () => {
			githubExplorePage = await Browser.getAPage(browser, githubExploreUrl);
			expect(githubExplorePage.url()).toBe(githubExploreUrl);
		}, 30000);

		test('2. should have used about:blank and not created a new one', async () => {
			const pages = await browser.pages();
			expect(pages.length).toBe(1);
		}, 30000);

		test('3. should return existing GitHub Explore page when asked for GitHub Home', async () => {
			const githubHomePage = await Browser.getAPage(browser, githubUrl);
			expect(githubHomePage).toBe(githubExplorePage);
		}, 30000);

		test('4. should create a new page to go to Stackoverflow', async () => {
			const stackUrl = 'https://stackoverflow.com/';
			const stackPage = await Browser.getAPage(browser, stackUrl);
			const pages = await browser.pages();
			expect(stackPage.url()).toBe(stackUrl);
			expect(stackPage).not.toBe(githubExplorePage);
			expect(pages.length).toBe(2);
		}, 3000);
	});

});