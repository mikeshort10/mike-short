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
	res.render(process.cwd() + '/index.pug');
})

app.get('*', (req, res) => {
	res.redirect('/');
})


app.listen(port = process.env.PORT || 3000, function () {
	console.log('Node JS listening on port ' + port)
})
