module.exports = {
	name: 'stop',
	description: 'Stops the current song and empties the song queue.',
	cooldown: 5,
	execute(message, args) {
		if(!message.member.voiceChannel)
			return message.channel.send('You must be in a voice channel to stop the music!');

		const serverQueue = message.client.queue.get(message.guild.id);
		if(!serverQueue)
			return message.reply('No songs queued. Please queue a song first before trying to stop');

		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};