#!/usr/bin/env node

const yargs = require('yargs');

// Get .env variables
require('dotenv').config();

// Configure yargs
yargs
    .usage('Usage: $0 <command> [options]')
    .commandDir('commands')
    .help()
    .demandCommand()
    .argv;
