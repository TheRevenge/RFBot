const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'help',
	description: 'Donne la liste des commandes et les détails sur une commande spécifique.',
	aliases: ['h', 'commands', 'cmds'],
	usage: '[command name]',
	execute(message, args) {
		// Loading up commands
		const { commands } = message.client;

		// Embded pre-config
		const embded = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTimestamp()
			.setFooter(config.name, config.img)
			.setAuthor(config.name, config.img);

		// With specific command
		if (args[0]) {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				embded.setColor('#FF0106')
					.setTitle('Error :')
					.setDescription('Invalid argument.');
				return message.channel.send(embded);
			}

			// Building up embded
			embded.setTitle(`Commande - ${command.name}`);

			if (command.aliases && command.description) {
				embded.setDescription(`Aliases : \`\`${command.aliases.join(', ')}\`\` \n${command.description}`);
			}
			else if (command.description) {
				embded.setDescription(`${command.description}`);
			}
			if (command.usage) {
				embded.addField('Usage', `\`\`${config.prefix}${command.name} ${command.usage}\`\``);
			}
			else{
				embded.addField('Usage', `\`\`${config.prefix}${command.name}\`\``);
			}

		}
		// Default message
		else {
			const commandList = [];
			commandList.push(commands.map(command => command.name).join('``, ``'));

			embded.setTitle('Commandes - Tout')
				.setDescription(`Voici la liste des commandes, fais \`\`${config.prefix}help [commande]\`\` pour avoir plus de détails. \n \`\`${commandList}\`\``);
		}

		message.channel.send(embded);

	},
};
