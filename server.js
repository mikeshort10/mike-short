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
	res.render(__dirname + "/views/homepage.pug", {
		about: [
			"My journey to becoming a software developer is definitely not a conventional one. After graduating with a degree in Germanic Studies, I began working with international students. Finding that the school's software was often geared toward native speakers, I learn Javascript and develop applications that would help them more intuitively navigate life at the school, such as picking classes or getting involved in activities.",
			"From the moment I printed my first 'Hello World', I knewthat this would become my full-time career. I left my position at the high school and started my own free-lance development company. Now I work with clients, either one-on-one or as part of team, turning their visions and dreams into realities.",
			"There are two main things you can expect from me when I agree to work with you: reliability and innovation. Your goals are important to me, and I will always deliver on the deadlines that we set, if not sooner. Your visions and ideas are also unique and shouldn't be approach with a cookie-cutter mentality. While I'm not going to reinvent the wheel, who wouldn't want to fly a hoverboard?",
		],
		MSCS: [
			"0000000000000000000000000000000000000000000000000000000000000000",
			"001100011011011001110111111000011110011001100111100111110011111100",
			"001110111011011011100110000000110000011001101100110110011000110000",
			"001111111011011111000111100000011110011111101100110111110000110000",
			"001101011011011011100110000000000011011001101100110110110000110000",
			"001100011011011001110111111000011110011001100111100110011000110000",
			"0000000000000000000000000000000000000000000000000000000000000000",
			"0011111001111001111100110110001100111100",
			"001100000110011011001101101110011011000000",
			"001100000110011011001101101101011011011100",
			"001100000110011011001101101100111011001100",
			"0011111001111001111100110110001100111100",
			"00000000000000000000000000000000000000000000000000000000000000",
			"0001111000111100110000001100110111111011001111001100011001111000",
			"0011000001100110110000001100110001100011011001101110011011000000",
			"0001111001100110110000001100110001100011011001101101011001111000",
			"0000001101100110110000001100110001100011011001101100111000001100",
			"0001111000111100111111100111100001100011001111001100011001111000",
			"00000000000000000000000000000000000000000000000000000000000000",
		],
		skills: [
			[
				{ name: "Node.js", type: "Backend" },
				{ name: "Express.js", type: "Backend" },
				{ name: "MongoDB", type: "Backend" },
				{ name: "Postgres", type: "Backend" },
				{ name: "Typeorm", type: "Backend" },
				{ name: "SQL", type: "Backend" },
				{ name: "Mongoose", type: "Backend" },
			],
			[
				{ name: "HTML5", type: "Styling" },
				{ name: "CSS3", type: "Styling" },
				{ name: "Sass", type: "Styling" },
				{ name: "Pug", type: "Styling" },
				{ name: "Bootstrap", type: "Styling" },
				{ name: "jQuery", type: "Styling" },
			],
			[
				{ name: "Javascript/ES6", type: "Scripting" },
				{ name: "React", type: "Scripting" },
				{ name: "Redux", type: "Scripting" },
				{ name: "Typescript", type: "Scripting" },
			],
			[
				{ name: "Jest", type: "Testing" },
				{ name: "Enzyme", type: "Testing" },
				{ name: "Mocha", type: "Testing" },
				{ name: "Chai", type: "Testing" },
			],
		],
		projects: [
			{
				name: `Lindsay Granger and the Imperius Curse`,
				src: "lindsay-granger.png",
				description: "Dungeon Crawler Game for HP Fans",
				href: "/games/lindsay-granger",
				color: "black",
				background: "hsl(60, 75%, 85%)",
				fontFamily: "lumos",
				gitHref:
					"https://github.com/mikeshort10/mike-short/tree/master/games/src/components/Granger",
			},
			{
				name: "Poll Pool",
				src: "pool-poll.ico",
				description: "MERN Stack Poll-Sharing Application",
				href: "https://the-poll-pool.herokuapp.com/",
				color: "grey",
				background: "lightblue",
				fontFamily: "waver",
				gitHref: "https://github.com/mikeshort10/poll-app",
			},
			{
				name: "Extracurricular Scheduler",
				src: "",
				description: "Choose clubs based on your interests",
				href: "/clubs",
				color: "#DDD",
				background: "hsl(300, 100%, 25%)",
				fontFamily: "monospace",
				gitHref:
					"https://github.com/mikeshort10/mike-short/tree/master/games/src/components/Clubs",
			},
			{
				name: "SPOCK PAPER SCISSORS",
				src: "sps.png",
				description: "If you thought Rock Paper Scissors was hard...",
				href: "/games/sps",
				color: "yellow",
				background: "black",
				fontFamily: "star-trek",
				gitHref:
					"https://github.com/mikeshort10/rock-paper-scissors-lizard-spock",
			},
		],
	});
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
});
