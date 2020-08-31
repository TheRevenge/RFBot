const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'ping',
	description: 'Vérifie si le bot est en ligne.',
	role: 'admin',
	execute(message) {
		const embed = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTitle('Pong !')
			.setDescription(`Latence : ${Date.now() - message.createdTimestamp}ms`)
			.setAuthor(config.name, config.img)
			.setTimestamp()
			.setFooter(config.name, config.img);
		message.channel.send(embed);
	},
};
