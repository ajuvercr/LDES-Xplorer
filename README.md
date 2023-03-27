# LDES Xplorer

> This name is not great, please fix.

This is a simple site that lets people browse through Linked Data Event Streams.
It tries to make everything clear for _normal_ people, whoever they may be.

People are expected to just click around on the tiles and be amazed by the carried LDES members.
It also tries to interpret some predicates by dereferencing the URI and hoping to find something that explains the URI.  

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

npm run dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.


## Deploy

The node adaptor is configured.

Build
```bash
npm run release
```

Run
```bash
bin/production.sh
```

