#! /bin/sh

pnpx prisma db push
node dist/app.js
