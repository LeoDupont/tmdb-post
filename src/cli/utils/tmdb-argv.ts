/**
 * Interface for arguments.
 * Doc : https://github.com/yargs/yargs/blob/master/docs/typescript.md
 */
export interface TmdbArgv {

	[x: string]: unknown;
	_: string[];
	$0: string;

	// === Auth ===

	/** Username */
	user: string;
	/** Password */
	pass: string;

	// === Puppeteer browser options ===

	/** Not headless mode */
	head: boolean;
	/** SlowMo */
	slow: boolean;
}