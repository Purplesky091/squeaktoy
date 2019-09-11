const player = require('./play.js');

module.exports = {
	name: 'squeak',
	description: 'plays a squeak from youtube.',
	execute(message, args) {
		player.execute(message, ['https://youtu.be/qfuAlOx6gPw']);
	},
};