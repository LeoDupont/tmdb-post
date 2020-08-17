import inquirer from "inquirer";
import chalk from "chalk";
import { TmdbArgv } from "./tmdb-argv";
import { Auth } from "../../module/tmdb-scraping/auth";
import { Config } from "../../module/config";

/**
 * Gets the user's credentials.
 */
export module CredentialsManager {

	// =======================================================
	// == TYPES
	// =======================================================

	export enum CredentialsSource {
		/** Prompts the user for their username and password to use them headlessly */
		prompt = 'prompt',
		/** Reads `TMDBPOST_USERNAME` and `TMDBPOST_PASSWORD` environment variables to use them headlessly */
		env = 'env',
	}
	export const AUTH_METHODS: ReadonlyArray<CredentialsSource> = [
		CredentialsSource.prompt,
		CredentialsSource.env,
	];

	// =======================================================
	// == GETTER
	// =======================================================

	/**
	 * Reads username and password from either:
	 * 1. The `-u` and `-p` arguments
	 * 2. The `TMDBPOST_USERNAME` and `TMDBPOST_PASSWORD` environment variables
	 * 3. Prompted user input
	 * @param argv Arguments
	 */
	export async function getCredentials(argv: TmdbArgv): Promise<Auth.Credentials> {

		let credentials: Auth.Credentials = {};

		// 1. Read args:
		if (argv.user) { credentials.username = argv.user; }
		if (argv.pass) { credentials.password = argv.pass; }

		// 2. Read env vars:
		if (! credentials.username) {
			credentials.username = Config.credentials.username;
		}
		if (! credentials.password) {
			credentials.password = Config.credentials.password;
		}

		// 3. Prompt:
		if (! credentials.username || ! credentials.password) {
			try {
				credentials = await inquirer.prompt([
					{ type: 'input', name: 'username', message: 'TMDb username:' },
					{ type: 'password', name: 'password', message: 'TMDb password:' },
				]);
			}
			catch (err) {
				console.error(chalk.red(err));
			}
		}

		return credentials;
	}
}
