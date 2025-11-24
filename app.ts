import express from "express";
import "dotenv/config";
import fs from "fs";

import { Router } from "./src/Router";
import { Middleware } from "./src/Middleware";

import { socketServer } from "./src/modules/websocket/server";

const app = express();

// ----------------------------------

// Folder Check
if (!fs.existsSync("./static")) {
  fs.mkdirSync("./static");
}

if (!fs.existsSync("./static/upload")) {
  fs.mkdirSync("./static/upload");
}

// CDN Folder
if (!fs.existsSync("./static/upload/cdn")) {
  fs.mkdirSync("./static/upload/cdn");
}

// Slip Folder
if (!fs.existsSync("./static/upload/slip")) {
  fs.mkdirSync("./static/upload/slip");
}

// ----------------------------------

Middleware(app);
Router(app);

socketServer(app);
