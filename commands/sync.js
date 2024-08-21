import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import chalk from 'chalk';

export default {
    command: 'sync',
    desc: 'Sync files from .blobfishrc file to your project',
    options: {
        token: {
            alias: 't',
            describe: 'Github Token',
            type: 'string',
        },
        verbose: {
            alias: 'v',
            describe: 'Verbose output',
            type: 'boolean',
        }
    },
    handler: async (argv) => {
        // Check if GH_TOKEN is passed as an argument
        const token = argv.token || argv.t || process.env.GH_TOKEN;
        if (!token) {
            console.error(chalk.redBright('🐡 GH_TOKEN is required. Please pass it as an argument using --token or set it as GH_TOKEN environment variable.'));
            process.exit(1);
        }
    
        // Check if verbose is passed as an argument
        const verbose = argv.verbose || argv.v || false;
    
        // Check if .blobfishrc file exists
        if (!existsSync('.blobfishrc')) {
            console.error(chalk.redBright('🐡 No .blobfishrc file detected. Run blobfish init first, or crete it manually.'));
            process.exit(1);
        }
    
        // Read .blobfishrc file
        var blobfish = JSON.parse(readFileSync('.blobfishrc', 'utf8'));
    
        // Validate .blobfishrc file
        const error = chalk.redBright('🐡 Invalid .blobfishrc file. Please check the documentation.')
        if (typeof blobfish !== 'object') {
            console.error(error);
            console.error("Structure is not an object.");
            process.exit(1);
        }
        if (!blobfish.replications) {
            console.error(error);
            console.error("Replications is not defined.");
            process.exit(1);
        }
        if (typeof blobfish.comment !== 'undefined' && typeof blobfish.comment !== 'string') {
            console.error(error);
            console.error("Comment is defined but is not a string.");
            process.exit(1);
        }
        for (const replication of blobfish.replications) {
            if (!replication.repository) {
                console.error(error);
                console.error("Repository is not defined.");
                process.exit(1);
            }
            if (!replication.files) {
                console.error(error);
                console.error("Files is not defined.");
                process.exit(1);
            }
            if (!Array.isArray(replication.files)) {
                console.error(error);
                console.error("Files is not an array.");
                process.exit(1);
            }
            for (const file of replication.files) {
                if (typeof file !== 'string' && typeof file !== 'object') {
                    console.error(error);
                    console.error("File is not a string or object.");
                    process.exit(1);
                }
                if (typeof file === 'object') {
                    if (!file.from || !file.to) {
                        console.error(error);
                        console.error("File object is missing from or to.");
                        process.exit(1);
                    }
                }
            }
        }
    
        // Sync files
        var totalFiles = 0;
        var syncedFiles = 0;
        for (const replication of blobfish.replications) {
            for (const file of replication.files) {
                totalFiles++;
                var from, to
                if (typeof file === 'string') {
                    from = to = file;
                } else if (typeof file === 'object') {
                    from = file.from;
                    to = file.to;
                }
    
                if (verbose) {
                    console.log(`🐡 Syncing ${from} from ${replication.repository} to ${to}`);
                }
    
                const apiUrl = `https://api.github.com/repos/${replication.repository}/contents/${from}`;
                const headers = {
                Authorization: `token ${token}`,
                };
                try {
                    const res = await fetch(apiUrl, { headers });
                    if (res.status !== 200) {
                        switch (res.status) {
                            case 401:
                                console.error(chalk.redBright(`🐡 Invalid token. Please check your GH_TOKEN environment variable or --token argument.`));
                                break;
                            case 404:
                                console.error(chalk.redBright(`🐡 Repository ${replication.repository} or file ${from} not found.`));
                                break;
                            default:
                                console.error(chalk.redBright(`🐡 Error while fetching ${apiUrl}: ${res.status} ${res.statusText}`));
                                break;
                        }
                        continue
                    }
                    const json = await res.json();
                    const content = Buffer.from(json.content, "base64").toString("utf-8");
    
                    // Create the directory if it doesn't exist
                    const path = to.split('/');
                    path.pop();
                    mkdirSync(`./${path.join('/')}`, { recursive: true });

                    const comment = blobfish.comment ?? `// 🐡 THIS FILE IS AUTOGENERATED, please do not edit manually. 🐡
// This is intended to represent an exact copy of:
// https://github.com/${replication.repository}/blob/main/${from}

// Once you commit your changes on that repository, run:
// blobfish sync
// and commit the changes on this repo too.\n`

                    // Write the file
                    writeFileSync(
                    `./${to}`,
                    `${comment}${content}`,
                    "utf-8"
                    );
                } catch (e) {
                    console.error(chalk.redBright(`🐡 Error while fetching ${apiUrl}: ${e}`));
                    continue
                }
                syncedFiles++;
    
                if (verbose) console.log(`🐡 Synced ${from} from ${replication.repository} to ${to}`);
            }
    
            if (verbose) console.log(chalk.greenBright(`🐡 Synced ${replication.repository}`));
        }
    
        console.log(chalk.greenBright(`🐡 Synced ${syncedFiles} out of ${totalFiles} files!`));
    }
}