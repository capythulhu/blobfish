[![npm version](https://badge.fury.io/js/blobfish.svg)](https://badge.fury.io/js/blobfish)

<p align="center">
    <img width="200" src="https://github.com/capythulhu/blobfish/assets/20731019/0cd8710d-139e-4cc9-a448-bfaffc98233e" alt="Blobfish Logo">
</p>

# blobfish

This binary allows you to dynamically sync files between GitHub repositories.

## 🐡 Install

You can install this package globally with:
```bash
npm install blobfish
```

## 🐡 Usage
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

Make sure you already have a GitHub token with the `repo` scope. You can create one [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

Then, create a `.env` file in your project root folder with the following content:
```bash
GH_TOKEN=<your_token>
```

Then, run the following command to sync your files:
```bash
blobfish sync
```

You can also run the ```blobfish sync``` command with the ```--token``` flag if you don't want to use a `.env` file:
```bash
blobfish sync --token <your_token>
```

And that's it! Your files will be copied to the specified repositories.
