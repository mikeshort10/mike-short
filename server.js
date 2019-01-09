const express = require('express');
const app = express();
const pug = require('pug');

app.set('port', process.env.PORT || 3000) 
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
})

app.listen(app.get('port'), function () {
	console.log('Node JS listening on port ' + app.get('port'))
})
