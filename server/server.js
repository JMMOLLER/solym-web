require("dotenv").config({ path: "./.env" });
require("./Services/scheduledTasks");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { args } = require("./Resources/yargs");
const { logger } = require("./Resources/pino");
const { config } = require("./Resources/corsConfig");
const app = express();
const HOST = args.host;
const PORT = args.port;

app.use(cors({
    origin: config.bind(null),
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/api/", require("./routers/middlewares/debug") , require("./routers/API"));
app.get("/", (req, res) => res.status(200).send("API is working successfully on v1.3.2!!"));

app.listen(PORT, () => {
    logger.info(`Application listening at http://localhost:${PORT}`);
});
