#!/usr/bin/env node

const yargs = require('yargs');
const { handler } = require('./commands/sync');

// Configure yargs
const argv = yargs
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands')
    .help()
    .argv;

// if no command passed, run console.log("hello")
if (yargs.argv._.length === 0) {
    handler(argv);
}
