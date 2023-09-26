import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);

app.post("/", (_, res) => {
  console.info("Start");

  setTimeout(() => {
    res.setHeader("Content-Type", "application/json");
    res.json({ value: 42 });
    console.info("Completed");
  }, 10000);
});

const checkPortIsAvaliable = async (port: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    let s = createServer();
    s.once("error", (err) => {
      s.close();
      resolve(false);
    });
    s.once("listening", () => {
      resolve(true);
      s.close();
    });
    s.listen(port);
  });
};

const minPort = 3030;
const maxPort = 3100;

async function runServe() {
  let found = false;
  for (const offset of Array(maxPort - minPort + 1).keys()) {
    const port = minPort + offset;
    const canUse = await checkPortIsAvaliable(port);
    if (canUse) {
      app.listen(port);
      console.info(`Serving HTTP on :: port ${port} (http://[::]:3030/) ...`);
      found = true;
      break;
    }
  }

  if (!found) app.listen(minPort);
}

runServe();
