# Syndication Hack Week API

This project is a Node.js + TypeScript Express API for hack week to experiment with templating concepts for a future version of ISAPI - BBC Information Syndication API.

## Important!


This project was created during hack week. It's not intended to be production ready code, it is a work in progress. There are MANY features of production ISAPI that are missing. The project is intended to explore some ideas we've had around more flexible templating of partner syndication feeds.

## How It Works

## How It Works

The `/articles` endpoint is the main entry point for generating feeds. When a request is made, the API validates the provided parameters (such as `feed`, `api_key`, `number_of_items`, and `mixins`). The `api_key` is matched against the partner configuration to determine which partner is making the request and which template should be used. Feed configuration, partner configuration, and template configuration are all loaded from JSON files in the `data/` directory.

The combination of request parameters and these config files determines the structure and content of the feed. For example, the `feed` parameter selects which topic/curation to syndicate, while the `mixins` parameter controls which additional fields (like summaries or thumbnails) are included in each item. The partner's config specifies which Handlebars template to use for rendering, and the template config defines the template's file path and the response content type (RSS XML or JSON Feed).

To fetch the latest content, the API makes calls to the BBC FABL API. The FABL API is accessed using mutual TLS (mTLS), with certificate paths specified in the `.env` file as `CERT_PATH`, `KEY_PATH`, and `CA_PATH`. The `feed` parameter is used to look up a `topicId` from the feed config, and this `topicId` is then passed to the FABL API to retrieve topic and curation data. For each curation, the API requests content summaries, using the `number_of_items` parameter to limit the number of articles returned. The results are then filtered and formatted according to the request and partner configuration before being rendered by the appropriate Handlebars template.

The API uses Handlebars templates to render the final feed output. The template receives the topic, the list of content summaries, the original article request, and other context. This allows for flexible, partner-specific formatting of the feed, supporting both RSS and JSON Feed output as defined in the template config.

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

## Example Requests

### RSS

#### /news

- [http://localhost:3000/articles?feed=news&api_key=partner_a_api_key&number_of_items=10](http://localhost:3000/articles?feed=news&api_key=partner_a_api_key&number_of_items=10) RSS feed for /news with 10 items, no mixins
- [http://localhost:3000/articles?feed=news&api_key=partner_a_api_key&mixins=summary&number_of_items=10](http://localhost:3000/articles?feed=news&api_key=partner_a_api_key&mixins=summary&number_of_items=10) RSS feed for /news with 10 items, summary mixin
- [http://localhost:3000/articles?feed=news&api_key=partner_a_api_key&mixins=summary,thumbnail_images&number_of_items=10](http://localhost:3000/articles?feed=news&api_key=partner_a_api_key&mixins=summary,thumbnail_images&number_of_items=10) RSS feed for /news with 10 items, summary and thumbnail mixins

#### /sport/football

- [http://localhost:3000/articles?feed=sport-football&api_key=partner_a_api_key&number_of_items=10](http://localhost:3000/articles?feed=sport-football&api_key=partner_a_api_key&number_of_items=10) RSS feed for /sport/football with 10 items, no mixins
- [http://localhost:3000/articles?feed=sport-football&api_key=partner_a_api_key&mixins=summary&number_of_items=10](http://localhost:3000/articles?feed=sport-football&api_key=partner_a_api_key&mixins=summary&number_of_items=10) RSS feed for /sport/football with 10 items, summary mixin
- [http://localhost:3000/articles?feed=sport-football&api_key=partner_a_api_key&mixins=summary,thumbnail_images&number_of_items=10](http://localhost:3000/articles?feed=sport-football&api_key=partner_a_api_key&mixins=summary,thumbnail_images&number_of_items=10) RSS feed for /sport/football with 10 items, summary and thumbnail mixins

### JSON feed

#### /news

- [http://localhost:3000/articles?feed=news&api_key=partner_b_api_key&number_of_items=10](http://localhost:3000/articles?feed=news&api_key=partner_b_api_key&number_of_items=10) RSS feed for /news with 10 items, no mixins
- [http://localhost:3000/articles?feed=news&api_key=partner_b_api_key&mixins=summary&number_of_items=10](http://localhost:3000/articles?feed=news&api_key=partner_b_api_key&mixins=summary&number_of_items=10) RSS feed for /news with 10 items, summary mixin
- [http://localhost:3000/articles?feed=news&api_key=partner_b_api_key&mixins=summary,thumbnail_images&number_of_items=10](http://localhost:3000/articles?feed=news&api_key=partner_b_api_key&mixins=summary,thumbnail_images&number_of_items=10) RSS feed for /news with 10 items, summary and thumbnail mixins

#### /football

- [http://localhost:3000/articles?feed=sport-football&api_key=partner_b_api_key&number_of_items=10](http://localhost:3000/articles?feed=sport-football&api_key=partner_b_api_key&number_of_items=10) RSS feed for /sport/football with 10 items, no mixins
- [http://localhost:3000/articles?feed=sport-football&api_key=partner_b_api_key&mixins=summary&number_of_items=10](http://localhost:3000/articles?feed=sport-football&api_key=partner_b_api_key&mixins=summary&number_of_items=10) RSS feed for /sport/football with 10 items, summary mixin
- [http://localhost:3000/articles?feed=sport-football&api_key=partner_b_api_key&mixins=summary,thumbnail_images&number_of_items=10](http://localhost:3000/articles?feed=sport-football&api_key=partner_b_api_key&mixins=summary,thumbnail_images&number_of_items=10) RSS feed for /sport/football with 10 items, summary and thumbnail mixins

## Troubleshooting

- Ensure your `.env` file is set up with correct certificate paths.
- If you see "Could not find declaration for module express", run:
  ```sh
  npm install --save-dev @types/express
  ```
- For other missing types, install the corresponding `@types/*` package.

---