const express 		= require('express');
const app 			= express();
const bodyParser 	= require('body-parser');
const nodemailer 	= require('nodemailer');
const helmet 		= require('helmet');
const cors 			= require('cors');
const path 			= require('path');
const router 		= express.Router();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'games', 'build')));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render(process.cwd() + '/views/index.pug');
})

app.get('/games/sps', (req, res) => {
	res.render(process.cwd() + '/views/sps.pug');
})

app.get('/plus/you', (req, res) => {
	res.render(process.cwd() + '/views/vday.pug')
})

app.get('/games/light-bright', (req, res) => {
	res.sendFile(process.cwd() + '/games/build/index.html');
})

app.use('/games', router
	.get('/lindsay-granger', (req, res) => {
			console.log('here');
			res.sendFile(process.cwd() + '/games/build/index.html');
	})
)

app.listen(port = process.env.PORT || 5000, function () {
	console.log('Node JS listening on port ' + port)
})
