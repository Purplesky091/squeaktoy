const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const Client = require('./client/client.js');
const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});


// on means the event can trigger multiple times
// Once means the event only triggers once.
client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot)
		return;

	// the / +/ is a regex. I'm certain it's just [ ]+ in a different format.
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	// const command = client.commands.get(commandName);
	const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	// if the user needs to provide arguments, this will tell the user to provide them.
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}`;
		if(command.usage)
			reply += `\nThe proper usage would be\n${prefix}${command.name} ${command.usage}`;

		return message.channel.send(reply);
	}

	// for guild only commands (like !kick), don't allow them execute it through DMs.
	if (command.guildOnly && message.channel.type !== 'text')
		return message.reply('This command does not work through DMs!');

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);