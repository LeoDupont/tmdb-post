import { TmdbPost } from "..";
import { Config } from "../config";

export module TestHelpers {

	/**
	 * Inits a TmdbPost instance and:
	 * - attaches to a browser if Chromium wsDebuggerUrl is provided as an environment variable,
	 * - or logs in to TMDb if credentials are provided in env vars.
	 */
	export async function initAndLogInTmdb() {
		// Init:
		const tmdb = new TmdbPost();
		await tmdb.init({ headless: false, slowMo: 100 }, Config.browsers.WS_DEBUGGER_URL);

		// Log in:
		if (!Config.browsers.WS_DEBUGGER_URL) {
			await tmdb.logIn({ username: Config.credentials.username, password: Config.credentials.password });
		}

		return tmdb;
	}

}