import dotenv from 'dotenv';
import { DateLocale } from '../data/options';
dotenv.config();

export const ENV_VARS_NAMES = {
	username: 'TMDBPOST_USERNAME',
	password: 'TMDBPOST_PASSWORD',
};

export const Config = {
	credentials: {
		username: process.env[ENV_VARS_NAMES.username],
		password: process.env[ENV_VARS_NAMES.password],
	},

	/** Defaults to `DMY` */
	dateLocale: <DateLocale> process.env.TMDBPOST_DATE_LOCALE || DateLocale.DMY,

	browsers: {
		WS_DEBUGGER_URL: process.env.TMDBPOST_WS_DEBUGGER_URL,
		EXECUTABLE_PATH: process.env.TMDBPOST_BROWSER_EXECUTABLE_PATH,
		PROFILE_DIR: process.env.TMDBPOST_BROWSER_PROFILE_DIR,
	},
};
