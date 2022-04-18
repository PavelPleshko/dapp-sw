# frontend-homework-starter

## Setup

Clone this repository to your local machine and once done, delete the local `.git` directory and initialize a new repository which you can later share with us. 

Alternatively, you can opt to download the zip archive from Github and skip deleting the `.git` directory.

### Clone the repository:

```bash
git clone git@github.com:Swivel-Finance/frontend-homework-starter.git

cd frontend-homework-starter
```

### Remove the local `.git` folder:

```bash
rm -rf .git
```

### Initialize a new repository:

```bash
git init
git add .
git commit -m 'chore: initial commit'
git branch -M main
```

### Share the repository:

Create an **empty**, public repository on your Github account (don't add any initial files to it via the web interface). Copy the repository url, set it as your local repository's remote, and push your changes.

```bash
git remote add origin git@github.com:<your_username>/<your_repository_name>.git

git push -u -f origin main
```

Now you're setup and can share your repository with us.

## Development

For your convenience, a package.json with dependencies and scripts has been set up already. We recommend you use this, as it spares you some time setting up your local development environment and build configuration. If you have other preferences, feel free to change this.

### Install dependencies:

To get everything ready to go, you'll want to install the dependencies.

```bash
npm ci
```

### Run your app locally:

To run your app locally, you'll want to run `tsc`, `rollup` and `postcss` in watch-mode and serve the local build directory using a dev-server. All this is done by running the `start` script.

```bash
npm run start
```

If you prefer, you can also run scripts in separate terminal sessions.

```bash
npm run build:watch
```

```bash
npm run bundle:watch
```

```bash
npm run css:watch
```

```bash
npm run serve:watch
```

### Linting your code:

We prepared a lint configuration and expect you to adhere to its rules. In some cases rules might be excessively restrictive in which case you are allowed to disable a rule per file or per line - but be sure you have a good reason to do so. You can lint your code at any time running:

```bash
npm run lint
```

### Bundle for production:

You can test if your code will build correctly for production and inspect your bundle size by running:

```bash
npm run vercel
```
