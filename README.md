## 1. Installation

Install the dependencies:

```bash
npm install
```

## 2. Environment variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `CONTENTFUL_SPACE_ID`: This is the Space ID from your Contentful space.
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN`: This is the Content Preview API - access token, which is used for fetching **draft** data from your Contentful space.

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.
