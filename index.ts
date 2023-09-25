import express from "express";
import cors from "cors";

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

app.options("/");

app.listen(3030);
