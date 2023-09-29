[![npm version](https://badge.fury.io/js/angular2-expandable-list.svg)](https://badge.fury.io/js/blobfish)

<p align="center">
    <img width="200" src="https://github.com/capythulhu/blobfish/assets/20731019/8ecf9b77-8a17-474d-9927-485ac964a7ac" alt="Blobfish Logo">
</p>

# blobfish

This binary allows you to dynamically sync files between GitHub retpositories.

## Install

You can install this package globally with:
```bash
npm install -g blobfish
```

## Usage
Run the following command in your project root folder:
```bash
blobfish init
```
Or, manually create a `.blobfish` file in your project root folder. The file is a JSON array of objects with the following structure:
```json
[
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
]
```
> As you can see, you can specify a file path to copy to, or just the file name to copy to the same directory.

Then, run the following command to sync your files:
```bash
blobfish sync
```

And that's it! Your files will be copied to the specified repositories.
