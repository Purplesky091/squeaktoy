const ytdl = require('ytdl-core');

module.exports = {
	name: 'play',
	description: 'Plays the song provided by the youtube link.',
	usage: '[youtube-url]',
	args: true,
	async execute(message, args) {

		if (args[0] === 'help') {
			this.help(message);
			return;
		}
		// remember that this "queue" is actually a Map! I guess it preserves insertion order.
		/* It also seems that this "queue" variable is actually a set of queues. It holds each server's queues.
		This would be for whenever you get your bot distributed across many different servers! (we probably should hold our horses here.)
		*/
		const queue = message.client.queue;
		const serverQueue = message.client.queue.get(message.guild.id);
		const voiceChannel = message.member.voiceChannel;

		if(!voiceChannel)
			return message.channel.send('You must be joined to a voice channel in order for me to play!');

		const permissions = voiceChannel.permissionsFor(message.client.user);
		if(!permissions.has('CONNECT') || !permissions.has('SPEAK'))
			return message.channel.send('Please give me speaking and connecting privileges');

		const songInfo = await ytdl.getInfo(args[0]);
		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
		};

		if(serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return message.channel.send(`${song.title} has been added to the queue.`);
		} else {
			const queueConstruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			queue.set(message.guild.id, queueConstruct);

			queueConstruct.songs.push(song);
			try {
				var connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				this.play(message, queueConstruct.songs[0]);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		}
	},

	play(message, song) {
		const queue = message.client.queue;
		const guild = message.guild;
		const serverQueue = queue.get(message.guild.id);

		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
			.on('end', () => {
				console.log('Song ended');
				serverQueue.songs.shift();
				this.play(message, serverQueue.songs[0]);
			})
			.on('error', error => {
				console.error(error);
			});

		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	},
	help(message) {
		return message.reply(`\nName: ${this.name}\nDescription: ${this.description}\nUsage: !play ${this.usage}`);
	},
};