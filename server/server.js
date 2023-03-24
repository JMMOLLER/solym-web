require("dotenv").config({ path: "./.env" });
require("./Services/scheduledTasks");
const path = require("path");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { args } = require("./Resources/yargs");
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
app.use(express.static(path.join(__dirname, "..") + "/client/build"));
app.use(express.static("public"));
app.use("/api/", require("./routers/API"));
// app.use("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "..") + "/client/build/index.html");
// });

app.listen(PORT, HOST, () => {
    console.log(`Application listening at http://${HOST}:${PORT}`);
});
