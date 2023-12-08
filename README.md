<div align="center">
  <img src="static/icon512.png" alt="Kubernetes Logo" width="160">
  <h1>Menumal Menagement Platform - deprecated</h1>
	<p>A platform to manage subscriptions expirings and backdoor the accounts for faster customer service - deprecated by airtable</p>
</div>
<br>

## 🚀 Features

- **_WebApplication_** written in typescript with SvelteKit
- **_Dockerfile_** file for building the app
- **_Authentication_** with FirebaseAuth
- MongoDB **_Database_** with Mongoose
- Integration with Airtable
- **_Progressive Web app_** with caching and optimistic UI - when offline uses the local store to store the requests and when back online makes them and notifies the user only if there was an error
- **_CI/CD_** with GitHub and Vercel

## 💻 Tech & Stuff used for this project

![PWA](https://img.shields.io/badge/PWA-%234FC08D.svg?style=for-the-badge&logo=pwa&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Svelte Kit](https://img.shields.io/badge/Svelte%20Kit-%23FF3E00.svg?style=for-the-badge&logo=svelte&logoColor=white)
![npm](https://img.shields.io/badge/npm-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Firebase Auth](https://img.shields.io/badge/Firebase%20Auth-%23FFCA28.svg?style=for-the-badge&logo=firebase&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Airtable](https://img.shields.io/badge/Airtable-%23339933.svg?style=for-the-badge&logo=airtable&logoColor=white)

## Developing

### Install dependencies

```bash
`npm install`
```

### Start a development server:

```bash
`npm run dev`
`npm run dev -- --open` per aprirlo automaticamente in una pagina sul browser
```

### Build the app

```bash
`npm run build`
`npm run preview`
```

## Docker

### Build image

```bash
    `docker build -t gestionale ./`
```

### Start a local server

```bash
    `docker run -d -p 3000:3000 \`
    `-e origin=http://localhost:3000 \`
    # `--mount type=bind,source="$(pwd)"/data/,target=/app/data/ \`
    `gestionale`
```

### Production link:

[https://gestionale-menumal.vercel.app/](https://gestionale-menumal.vercel.app/)
