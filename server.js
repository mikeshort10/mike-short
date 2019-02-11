const express 		= require('express');
const app 			= express();
const dotenv 		= require('dotenv').config();
const bodyParser 	= require('body-parser');
const nodemailer 	= require('nodemailer');
const helmet 		= require('helmet');
const cors 			= require('cors');
const path 			= require('path');
const router 		= express.Router();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');



app.get('/', (req, res) => {
	res.render(process.cwd() + '/views/index.pug');
})

app.get('/games/sps', (req, res) => {
	res.render(process.cwd() + '/views/sps.pug');
})

app.use('/games', router
	.get('/sps', (req, res) => {
			res.render(path.join(__dirname, 'games', 'sps', 'index.pug'));
		})
	.use(express.static(path.join(__dirname, 'games')))
	.get("*", (req, res) => {
			res.sendFile(path.join(__dirname, 'games', 'build', 'index.html'));
		})
	/*.use('/lindsay-granger', router
		.use(express.static(path.join(__dirname, 'games/lindsay-granger')))
		.get('/', (req, res) => {
			res.sendFile(path.join(__dirname, '/games/lindsay-granger/build/index.html'))
		}))*/
	)


app.listen(port = process.env.PORT || 5000, function () {
	console.log('Node JS listening on port ' + port)
})
