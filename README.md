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
> Specifying the `from` and `to` fields allows you to copy the file to a different path in the target repository, but if you only provide the filename, the path will be the same as the original file.

If the `comment` field is present, it overrides the original auto-generated comment.

> You can use `{{url}}` in the `comment` to add the URL of the repository to your custom comment.

However, if you wish to keep the original comment but change the delimiter, you can add the `commentDelimiter` field instead, like: ```"commentDelimiter": "#"```.

Make sure you already have a GitHub personal access token with the `repository` scope. You can create one [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

Then, create a `.env` file in your project root folder with the following content:
```bash
GH_TOKEN=<your_token>
```
> You can also set the `GH_TOKEN` environment variable directly.

Then, run the following command to sync your files:
```bash
npx blobfish sync
```

You can also run the ```blobfish sync``` command with the ```--token``` flag if you don't want to use a `.env` file:
```bash
npx blobfish sync --token <your_token>
```

And that's it! Your files will be copied to the specified repositories.

## 🐡 Coming Soon
- Comments and delimiters customization per file type
- Support non GitHub repositories