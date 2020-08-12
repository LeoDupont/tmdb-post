import dotenv from 'dotenv';
dotenv.config();

export const ENV_VARS_NAMES = {
	username: 'TMDB_POST_USERNAME',
	password: 'TMDB_POST_PASSWORD',
};

export const Config = {
	credentials: {
		username: process.env[ENV_VARS_NAMES.username],
		password: process.env[ENV_VARS_NAMES.password],
	}
};
