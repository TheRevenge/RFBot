// npm install discord.js
// npm install chalk
// npm install chalk-animation

// Starting chrono
const t0 = new Date();

// Libraries
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');

// Functions
const log = function(m, sL = false, c = null) {
	// Single-line
	if (sL) {
		// Colorized
		process.stdout.write(m);
	}
	else{
		if (c) {
			return console.log(chalk.keyword(c)(m));
		}
		else{
			return console.log(m);
		}
	}
};

log('Initialization...', true);
const client = new Discord.Client();
client.commands = new Discord.Collection();
log(' OK', false, 'green');

log('Loading commands...', true);
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
log(' OK', false, 'green');

client.once('ready', () => {
	log(' OK', false, 'green');
	log('== SUCCESS ==', false, 'green');
	log(`Guilds count : ${client.guilds.cache.size}`);
	log(`Prefix : ${config.prefix}`);
	log(`Commands loaded : ${commandFiles.length}`);
	const t1 = new Date() - t0;
	log(`Took : ${Math.round(t1)}ms`);
	log('=============', false, 'green');
	// chalkAnimation.rainbow('Made with <3 by CptHenri');
});

client.on('message', message => {

	// Prefix check
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	// Parsing data
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Fetching command with aliases
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// See if require special rôle
	if(command.role) {
		const roles = config.roles;
		switch (command.role) {
		case 'admin':
			if (!message.member.roles.cache.some(role => role.id === roles.admin)) {
				const embded = new Discord.MessageEmbed()
					.setColor(config.color)
					.setTimestamp()
					.setFooter(config.name, config.img)
					.setAuthor(config.name, config.img)
					.setColor('#FF0106')
					.setTitle('Cette commande nécessite le rôle admin !');
				return message.reply(embded);
			}
			break;
		default:

		}
	}

	// See if require args
	if (command.args && !args.length) {
		const embded = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTimestamp()
			.setFooter(config.name, config.img)
			.setAuthor(config.name, config.img)
			.setColor('#FF0106')
			.setTitle('Cette commande nécessite un/des argument(s)')
			.setDescription(`Fais ${config.prefix}help ${command.name} pour obtenir de l'aide`);
		return message.reply(embded);
	}

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		const embded = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTimestamp()
			.setFooter(config.name, config.img)
			.setAuthor(config.name, config.img)
			.setColor('#FF0106')
			.setTitle('Une erreur s\'est produite avec cette commande :')
			.setDescription(error);
		message.reply(embded);
	}
});

/* eslint-disable max-nested-callbacks*/
client.on('guildMemberAdd', guildMember => {
	// Blocking access to others channel until verification

	const unverifiedRole = guildMember.guild.roles.cache.find(r => r.id === config.roles.unverified); // eslint-disable-line no-unused-vars
	guildMember.roles.add(unverifiedRole);

	client.channels.fetch(config.verifyChannel)
		.then(() => {
			const embded = new Discord.MessageEmbed()
				.setColor(config.color)
				.setTimestamp()
				.setFooter(config.name, config.img)
				.setAuthor(config.name, config.img)
				.setTitle(`Bienvenue ${guildMember.user.tag} !`)
				.setDescription('Pour avoir accès à l\'entièreté de ce serveur, fais !verify dans le salon de vérification');
			guildMember.send(embded);
		});

});
/* eslint-enable */
try {
	log('Loggin in...', true);
	client.login(process.env.BOT_TOKEN);
}
catch (e) {
	log(chalk.red(e));
}
