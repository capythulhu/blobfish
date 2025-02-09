[![npm version](https://img.shields.io/npm/v/blobfish)](https://www.npmjs.com/package/blobfish)
![sexiest package](https://img.shields.io/badge/rated-%231_sexiest_package-pink
)

<p align="center">
    <img width="200" src="https://github.com/capythulhu/blobfish/assets/20731019/0cd8710d-139e-4cc9-a448-bfaffc98233e" alt="Blobfish Logo">
</p>

# blobfish

This package allows you to dynamically sync files between GitHub repositories.

## 🐡 Install

You can install this with:
```bash
npm i -g blobfish
```

## 🐡 Usage
Run the following command in your project root folder:
```bash
blobfish init
```
> You can also install blobfish as a dev dependency by running `npm i -D blobfish` and then run commands like this: `npx blobfish init`.

Or, manually create a `.blobfishrc` file in your project root folder. Here's an example of the JSON file:
```json
{
  "replications": [
    {
      "repository": "cool-org/awesome-repo",
      "branch": "main",
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
> Specifying the `from` and `to` fields allows you to copy the file to a different path in the target repository. If you only provide the filename, the path will be the same as the original file.

Use the `branch` field to specify a branch to fetch your file from.

If the `comment` field is present, it overrides the original auto-generated comment.

> You can use `{{url}}` in the `comment` to add the URL of the repository to your custom comment.

However, if you wish to keep the original comment but change the delimiter, you can add the `commentDelimiter` field instead, like: ```"commentDelimiter": "#"``` for `.py` files.

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

You can also input the token directly in the command line:
```bash
blobfish sync --token <your_token>
```

And that's it! Your files will be copied to the specified repositories.

## 🐡 Coming Soon
- Support non GitHub repositories
