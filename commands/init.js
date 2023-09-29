const fs = require('fs');

exports.command = 'init'
exports.desc = 'Add .blobfish file to the root of your project'
exports.handler = function (argv) {
    if (fs.existsSync('.blobfish')) {
        console.error('🐡 .blobfish file already exists!');
        process.exit(1);
    }
    fs.writeFileSync('.blobfish', JSON.stringify([
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

  console.log('🐡 .blobfish file created! You can now edit it and run blobfish sync.');
}