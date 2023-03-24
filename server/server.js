require("dotenv").config({ path: "./.env" });
require("./Services/scheduledTasks");
const { args } = require("./Resources/yargs");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const HOST = args.host;
const PORT = args.port;
const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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
