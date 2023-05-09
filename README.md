# Developing

Appena scaricata la repository Runnare `npm install` per installare le dipendenze
start a development server:

```bash
`npm run dev`
`npm run dev -- --open` per aprirlo automaticamente in una pagina sul browser
```

# Building

To create a production version of your app:

```bash
`npm run build`
```

You can preview the production build with `npm run preview`.

# Docker

## Creare immagine

```bash
    `docker build -t gestionale ./`
```

## Avviare il server

```bash
    `docker run -d -p 3000:3000 \`
    `-e origin=http://localhost:3000 \`
    # `--mount type=bind,source="$(pwd)"/data/,target=/app/data/ \`
    `gestionale`
```

## Link al sito in production

[https://gestionale-menumal.vercel.app/](https://gestionale-menumal.vercel.app/)
