# Simple Donate

make a self-hosted donation site easier than it should be :D

[🇺🇸](./README.md) [🇹🇭](./README_th.md)

## Table of Content

- [Simple Donate](#simple-donate)
  - [Table of Content](#table-of-content)
  - [Tech Stats](#tech-stats)
    - [FrontEnd](#frontend)
    - [BackEnd](#backend)
  - [Installation](#installation)
    - [Docker (Recommend!!!)](#docker-recommend)
    - [Manual Installing](#manual-installing)
      - [Front-End Part](#front-end-part)
        - [Serve by yourself](#serve-by-yourself)
        - [Using Cloudflare Page](#using-cloudflare-page)
      - [Back-End Part](#back-end-part)

## Tech Stats

### FrontEnd

- Prototype

  - JS: Vue.js + typescript + vite.js
  - CSS: Bootstrap 5

- Production

  - JS: Next.js + typescript
  - CSS: tailwind.css

- Streaming Overlay
  - HTML, CSS, JS (Vanilla + Socket.io) // >:D

### BackEnd

- express.js, typescript
- ORM
  - Prisma
- DB
  - PostgreSQL

## Installation

### Docker (Recommend!!!)

To make it really easy for setting up on 1 Machine / PC, I used docker to run everything up with help from docker-compose. You can setting this up by using this step...

1. Clone this repository

```sh
git clone https://github.com/kizuna-inc/simple-donate
```

2. run this command

```sh
cd simple-donate && docker compose up -d
```

3. wait for it.. and~~ TADA!!!! Finished

### Manual Installing

To setting up this manually at first I need you to clone this repository first

```sh
git clone https://github.com/kizuna-inc/simple-donate
```

#### Front-End Part

This part of the project have 2 ways to run

##### Serve by yourself

1. Go to frontend directory

```sh
cd frontend
```

2. Install dependencies

```sh
pnpm install
```

3. Build the project

```sh
pnpm build
```

4. Run the project

```sh
pnpm preview
```

##### Using Cloudflare Page
For this solution, You can throw this part of the project to Cloudflare Page as static files and setting up normally like in deploying `vue.js` static page on cloudflare page.

---

#### Back-End Part

1. Go to server directory

```sh
cd server
```

2. Install dependencies

```sh
pnpm install
```

3. Build the project

```sh
pnpm build
```

4. Run the project

```sh
node dist/app.js
```

---

Project Maintainer: 
- [Kizuna Inc](https://github.com/kizuna-inc) as Organization
- [Suphakit P.](https://github.com/dethMastery) as Head Developer 