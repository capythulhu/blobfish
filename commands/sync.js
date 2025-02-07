import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';

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
        const blobfishrc = JSON.parse(readFileSync('.blobfishrc', 'utf8'));
        // Read and parse the schema
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.resolve(__dirname, '../schemas/blobfishrc.json');
        const schema = JSON.parse(readFileSync(filePath, 'utf8'));
    
        // Validate .blobfishrc file
        const ajv = new Ajv({allErrors: true});
        ajvErrors(ajv);
        const validate = ajv.compile(schema);
        const valid = validate(blobfishrc);
        if (!valid) {
            console.error(chalk.redBright('🐡 Invalid .blobfishrc file. Please check the documentation.'));
            for (const error of validate.errors)
                console.error(chalk.redBright(`› ${error.instancePath} ${error.message}`));
            process.exit(1);
        }

        // Sync files
        var totalFiles = 0;
        var syncedFiles = 0;
        for (const replication of blobfishrc.replications) {
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
    
                const apiUrl = `https://api.github.com/repos/${replication.repository}/contents/${from}${replication.branch ? `?ref=${replication.branch}` : ''}`;
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

                    const delimiter = blobfishrc.commentDelimiter ?? '//';
                    let comment = blobfishrc.comment ?? `${delimiter} 🐡 THIS FILE IS AUTOGENERATED, please do not edit manually. 🐡
${delimiter} This is intended to represent an exact copy of:
${delimiter} {{url}}

${delimiter} Once you commit your changes on that repository, run:
${delimiter} npx blobfish sync
${delimiter} and commit the changes on this repo too.\n`

                    // Replace {{url}} with the API URL
                    comment = comment.replace(/{{url}}/g, `https://github.com/${replication.repository}/blob/main/${from}`);
                    
                    // Write the file
                    writeFileSync(
                    `./${to}`,
                    `${comment}\n${content}`,
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