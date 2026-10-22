import express from "express";
import healthRouter from "./routes/health";
import { requestLogger } from "./middleware/requestLogger";
import { loadData } from "./data/loadData";
import { createGraphRouter } from "./routes/graph";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(healthRouter);

const data = loadData();
app.use("/graph", createGraphRouter(data));

export default app;
