const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
// const router = express.Router();
// const fs = require("fs");

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");

app.get("/", (req, res) => {
	res.render(__dirname + "/views/index.pug");
});

app.get("/home", (req, res) => {
	res.render(path.join(__dirname, "views", "home.pug"));
});

app.get("/games/sps", (req, res) => {
	res.render(__dirname + "/views/sps.pug");
});

app.get("/plus/you", (req, res) => {
	res.render(__dirname + "/views/vday.pug");
});

app.use(express.static(path.join(__dirname, "games", "build")));

app.get("/games/light-bright", (req, res) => {
	res.sendFile(path.join(__dirname, "games", "build", "index.html"));
});

app.get("/games/lindsay-granger", (req, res) => {
	res.sendFile(path.join(__dirname, "games", "build", "index.html"));
});

app.get("/games/conways-game-of-life", (req, res) => {
	res.sendFile(path.join(__dirname, "games", "build", "index.html"));
});

app.get("/clubs", (req, res) => {
	res.sendFile(path.join(__dirname, "games", "build", "index.html"));
});

app.use((req, res, next) => {
	res.status(404)
		.type("text")
		.send("Not found");
});

app.listen((port = process.env.PORT || 5000), function() {
	console.log("Node JS listening on port " + port);
	console.log(`http://localhost:${port}`);
});
