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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const { interval = 1000 } = req.body;
  console.info(`Receive ${JSON.stringify(req.body)}`, new Date());

  setTimeout(() => {
    res.setHeader("Content-Type", "application/json");
    res.json(req.body);
    console.info("Completed", new Date());
  }, interval);
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
