# Syndication Hack Week API

This project is a Node.js + TypeScript Express API for hack week to experiment with templating concepts for a future version of ISAPI - BBC Information Syndication API.

## Important!

This project was created during hack week. It's not intended to be production ready code, it is a work in progress. There are MANY features of production ISAPI that are missing. The project is intended to explore some ideas we've had around more flexible templating of partner syndication feeds.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- (Optional) [yarn](https://yarnpkg.com/)

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd syndication-hack-week
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Copy the example `.env` file or create your own:

```sh
cp .env.example .env
```

Edit `.env` to set certificate paths and any other required variables.

### 4. Build the project

```sh
npm run build
```

This will:
- Compile TypeScript from `src/` to `dist/`
- Copy the `data/` folder to `dist/data/`

### 5. Start the server

```sh
npm start
```

The server will run on [http://localhost:3000](http://localhost:3000) by default.

### 6. Development mode

For hot-reloading during development:

```sh
npm run dev
```

## Project Structure

```
.
├── src/                # TypeScript source code
├── data/               # Feed configs and example data
├── templates/          # Handlebars templates
├── tests/              # Unit tests
├── dist/               # Compiled output (after build)
├── .env                # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Running Tests

```sh
npm test
```

## Useful Scripts

- `npm run build` — Compile TypeScript and copy data files
- `npm start` — Start the compiled server
- `npm run dev` — Start server with hot-reloading (using ts-node and nodemon)
- `npm test` — Run unit tests with Jest

## API Endpoints

- `GET /articles` — Main feed endpoint (see [docs/isapi.html](docs/isapi.html) for parameters)
- `POST /refresh-config` — Reloads config files from disk

## Troubleshooting

- Ensure your `.env` file is set up with correct certificate paths.
- If you see "Could not find declaration for module express", run:
  ```sh
  npm install --save-dev @types/express
  ```
- For other missing types, install the corresponding `@types/*` package.

---