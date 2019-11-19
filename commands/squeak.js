const player = require('./play.js');

module.exports = {
	name: 'squeak',
	description: 'plays squeaktoy sound from youtube.',
	execute(message, args) {
		player.execute(message, ['https://youtu.be/qfuAlOx6gPw']);
	},
};