import express from "express";
import "dotenv/config";

import { Router } from "./src/Router";
import { Middleware } from "./src/Middleware";

import { socketServer } from "./src/modules/websocket/server";

const app = express();

Middleware(app);
Router(app);

socketServer(app);
