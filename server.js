const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true}))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render(process.cwd() + '/views/index.pug');
})

app.route('/skills').get((req, res) => {
	res.render(process.cwd() + '/views/skills.pug');
})

app.route('/projects').get((req, res) => {
	res.render(process.cwd() + '/views/projects.pug');
})

app.route('/about-me').get((req, res) => {
	res.render(process.cwd() + '/views/aboutme.pug');
});

app.route('/contact')
	.post((req, res) => {
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: process.env.USERNAME,
		    pass: process.env.PASSWORD
		  }
		});

		var mailOptions = {
		  from: process.env.USERNAME,
		  to: process.env.USERNAME,
		  subject: "From Website: " + req.body.subject,
		  text: req.body.email + "<br>" + req.body.message
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
	})
	.get((req, res) => {
		res.render(process.cwd() + '/views/contact.pug');
	})


app.listen(port = process.env.PORT || 3000, function () {
	console.log('Node JS listening on port ' + port)
})
