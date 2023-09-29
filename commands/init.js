import { existsSync, writeFileSync } from 'fs';
import chalk from 'chalk';

export default {
    command: 'init',
    desc: 'Add .blobfish file to the root of your project',
    handler: (argv) => {
        if (existsSync('.blobfish')) {
            console.error(chalk.yellowBright('🐡 .blobfish file already exists!'));
            process.exit(1);
        }
        writeFileSync('.blobfish', JSON.stringify([
        {
            "repo": "<owner>/<repo>",
            "files": [
                "example_1.js",
                {
                    "from": "example_2.js",
                    "to": "dir/example.js"
                }
            ]
        }
        ], null, 2));
    
      console.log(chalk.greenBright('🐡 .blobfish file created! You can now edit it and run blobfish sync.'));
    }
}