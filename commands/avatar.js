const Discord = require('discord.js');
const config = require('../config.json');
module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
	aliases: ['icon', 'pfp'],
	execute(message) {
		let text;
		let imageUrl;

		if (!message.mentions.users.size) {
			text = 'Your avatar :';
			imageUrl = message.author.displayAvatarURL();
		}
		else{
			message.mentions.users.map(user => {
				text = user.username + '\'s avatar : ';
				imageUrl = user.displayAvatarURL();
			});
		}

		const exampleEmbed = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTitle(text)
			.setAuthor(config.name, config.img)
			.setDescription(imageUrl)
			.setThumbnail(imageUrl)
			.setTimestamp()
			.setFooter(config.name, config.img);
		message.channel.send(exampleEmbed);
	},
};
