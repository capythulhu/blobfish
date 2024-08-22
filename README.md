[![npm version](https://img.shields.io/npm/v/blobfish)](https://www.npmjs.com/package/blobfish)
![sexiest package](https://img.shields.io/badge/prize-%231_sexiest_package-pink
)

<p align="center">
    <img width="200" src="https://github.com/capythulhu/blobfish/assets/20731019/0cd8710d-139e-4cc9-a448-bfaffc98233e" alt="Blobfish Logo">
</p>

# blobfish

This package allows you to dynamically sync files between GitHub repositories.

## 🐡 Install

You can install this with:
```bash
npm i -D blobfish
```

## 🐡 Usage
Run the following command in your project root folder:
```bash
npx blobfish init
```
> You can also install blobfish globally by running `npm i -g blobfish` and then run just `blobfish init`, if you prefer.

Or, manually create a `.blobfishrc` file in your project root folder. The file is a JSON object with the following structure:
```json
{
  "replications": [
    {
      "repository": "cool-org/awesome-repo",
      "files": [
        "path/to/file.js",
        {
          "from": "path/to/another_file.js",
          "to": "target/path/to/another_file.js"
        }
      ]
    }
  ],
  "comment": "// This is a generated file"
}
```
> You can specify a file path to copy to, or just the file name to copy to the same directory.

> If the `comment` field is present, it overrides the default comment that is added at the beggining of the replicated file.

Make sure you already have a GitHub personal access token with the `repository` scope. You can create one [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

Then, create a `.env` file in your project root folder with the following content:
```bash
GH_TOKEN=<your_token>
```
> You can also set the `GH_TOKEN` environment variable directly.

Then, run the following command to sync your files:
```bash
blobfish sync
```

You can also run the ```blobfish sync``` command with the ```--token``` flag if you don't want to use a `.env` file:
```bash
blobfish sync --token <your_token>
```

And that's it! Your files will be copied to the specified repositories.
