import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import "dotenv/config";

const redisConfig = {
  host: process.env.reIP !== undefined ? process.env.reIP : "localhost",
  port:
    process.env.rePort !== undefined &&
    String(Number(process.env.rePort)) != "isNaN" &&
    Number(process.env.rePort) > 0
      ? Number(process.env.rePort)
      : 6379,
  db: 0,
  maxRetriesPerRequest: null,
};

const connection = new IORedis(redisConfig);

connection.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export const sQueue = new Queue(
  `${process.env.ROOM_NAME || "simple-donate"}_queue`,
  { connection }
);

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sWorker = new Worker(
  `${process.env.ROOM_NAME || "simple-donate"}_queue`,
  async (job) => {
    await delay(3000);
    console.log(job.data);
  },
  { connection }
);
