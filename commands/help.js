const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'Shows the list of commands for this bot, what they do, and how to use them.',
	cooldown: 5,
	execute(message, commands) {
		let reply = '';
		for (const command of commands) {
			reply += `Command: ${command.name}\nWhat it does: ${command.description}\n`;
			if (command.usage)
				reply += `How to use it: ${prefix}${command.name} ${command.usage}\n\n`;
			else
				reply += `How to use it: ${prefix}${command.name}\n\n`;
		}

		message.channel.send(reply);
	},
};