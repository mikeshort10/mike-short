const express = require('express');
const app = express();
const pug = require('pug');

app.set('port', process.env.PORT || 5000) 
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	res.render(process.cwd() + '/views/index.pug');
})

app.listen(app.get('port'), function () {
	console.log('Node JS listening on port ' + app.get('port'))
})