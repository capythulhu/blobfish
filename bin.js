#!/usr/bin/env node
import yargs from 'yargs';

// Get .env variables
import { config } from 'dotenv';
config();

// Import commands
import init from './commands/init.js';
import sync from './commands/sync.js';

// Configure yargs
const y = yargs()
y.usage('Usage: $0 <command> [options]')
y.version("1.3.1")

y.command(init)
y.command(sync)

y.help()

y.parse(process.argv.slice(2))

// If no command is passed, show help
if (!process.argv.slice(2).length) {
    y.showHelp()
}