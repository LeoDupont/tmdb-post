import chalk from "chalk";
import { Argv } from "yargs";
import { CredentialsManager } from "../utils/credentials-manager";
import { ENV_VARS_NAMES } from "../../config";

exports.command = 'post';
exports.desc = 'Post data to TMDb';

exports.builder = (yargs: Argv<{}>) => {
	return (
		yargs
			// Register subcommands from the `post_cmds` folder:
			.commandDir('post_cmds')
			.demandCommand()

			// === Global options to post subcommands ===

			// Auth:
			.option('u', {
				alias: 'user',
				describe: `TMDb username. If omitted, looks up the ${chalk.bold(ENV_VARS_NAMES.username)} environment variable. If null, uses a prompt.`,
				type: 'string',
			})
			.option('p', {
				alias: 'pass',
				describe: `TMDb password. If omitted, looks up the ${chalk.bold(ENV_VARS_NAMES.password)} environment variable. If null, uses a prompt.`,
				type: 'string',
			})

			// Browser:
			.option('h', {
				alias: 'head',
				describe: 'Runs a visible Chromium instance (not headless)',
				type: 'boolean',
				default: false,
			})
			.option('s', {
				alias: 'slow',
				describe: 'Slows down actions in the browser (adds 50 milliseconds to each action)',
				type: 'boolean',
				default: false,
			})
	);
};

exports.handler = (argv: any) => {};