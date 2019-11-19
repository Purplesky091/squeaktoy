const player = require('./play.js');

module.exports = {
	name: 'pizzatime',
	description: 'Pizza Time.',
	execute(message, args) {
		player.execute(message, ['https://www.youtube.com/watch?v=TRgdA9_FsXM&feature=youtu.be&t=1']);
	},
};