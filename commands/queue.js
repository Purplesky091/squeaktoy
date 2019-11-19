module.exports = {
	name: 'queue',
	description: 'Displays what is in queue.',
	execute(message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		var currentTracks = !serverQueue ? 'No songs in queue!' : JSON.stringify(serverQueue.songs, null, 2);
		message.channel.send(currentTracks);
	},
};