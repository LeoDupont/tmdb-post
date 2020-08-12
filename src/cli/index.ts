#!/usr/bin/env node

import yargs from 'yargs';

yargs
	.scriptName('tmdb')

	// Register commands from the `cmds` folder:
	.commandDir('cmds')
	.demandCommand()

	.help()
	.parse();
