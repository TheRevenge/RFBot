const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTitle('Pong !')
			.setAuthor(config.name, config.img)
			.addField('Latence du bot', `${Date.now() - message.createdTimestamp}ms`)
			.setTimestamp()
			.setFooter(config.name, config.img);
		message.channel.send(embed);
	},
};
