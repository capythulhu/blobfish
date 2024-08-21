import { existsSync, writeFileSync } from 'fs';
import chalk from 'chalk';

export default {
    command: 'init',
    desc: 'Add .blobfishrc file to the root of your project',
    handler: (argv) => {
        if (existsSync('.blobfishrc')) {
            console.error(chalk.yellowBright('🐡 .blobfishrc file already exists!'));
            process.exit(1);
        }
        writeFileSync('.blobfishrc', JSON.stringify({
            "$schema": "http://raw.githubusercontent.com/capythulhu/blobfish/main/schemas/blobfishrc.json",
            "replications": [
                {
                    "repository": "<owner>/<repo>",
                    "files": [
                        "example_1.js",
                        {
                            "from": "example_2.js",
                            "to": "dir/example.js"
                        }
                    ]
                }
            ],
        }, null, 2));
    
      console.log(chalk.greenBright('🐡 .blobfishrc file created! You can now edit it and run blobfish sync.'));
    }
}