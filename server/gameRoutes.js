const path 		= require ('path');

module.exports = function (router, db) => {
	router.route('/sps')
	.get((req, res, next) => {
		res.render(path.join(__dirname, 'games', 'sps', 'index.pug'));
	});

	router.route('*')
	.get((req, res, next) => {
		res.render(path.join(__dirname, 'games', 'game-router', 'build', 'index.html'));
	});
}