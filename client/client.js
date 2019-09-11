const { Client, Collection } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.commands = new Collection();
		// This "queue" member holds a mapping of
		// a server to its playlist/playqueue.
		// This queue gets initialized in play.js.
		this.queue = new Map();
		this.config = config;
	}
};