import chalk from "chalk";

exports.command = 'test';
exports.desc = 'Test the CLI';

exports.builder = {};

exports.handler = (argv: any) => {
	console.log(chalk.green("Test successful!"));
};