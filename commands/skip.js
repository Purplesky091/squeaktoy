module.exports = {
	name: 'skip',
	description: 'Ends the current song and skips to the next song in queue.',
	execute(message, args) {
		if(!message.member.voiceChannel)
			return message.reply('You must be in a voice channel to skip to the next song.');
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) {
			return message.reply('No songs in queue. Please queue a song');
		} else if (serverQueue.songs.length === 1) {
			message.reply('This is the last song in queue. Stopping song and emptying the queue.');
			serverQueue.songs = [];
		}

		serverQueue.connection.dispatcher.end();
	},
};