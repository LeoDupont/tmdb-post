import { CredentialsManager } from "../../utils/credentials-manager";
import { TmdbArgv } from "../../utils/tmdb-argv";
import { Browser } from "../../../module/browser";
import { Auth } from "../../../module/tmdb-scraping/auth";

exports.command = 'episodes';
exports.desc = 'Posts an episode to an existing TV show on TMDb';

exports.builder = {};

exports.handler = async (argv: TmdbArgv) => {

	// Credentials:
	const credentials = await CredentialsManager.getCredentials(argv);
	console.debug("credentials:", JSON.stringify(credentials));

	// Browser:
	const browser = await Browser.launchBrowser({ headless: !argv.head, slowMo: argv.slow ? 250 : 0 });
	console.debug("browser:", JSON.stringify(browser.userAgent));

	// Auth:
	const loggedIn = await Auth.authenticate(browser, credentials);
	console.debug("loggedIn:", loggedIn);

	// Post episodes:
	// TODO

	// Feedback?
	// TODO

	await browser.close();
};