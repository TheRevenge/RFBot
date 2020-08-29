const Discord = require('discord.js');
const config = require('../config.json');
const fs = require('fs');

module.exports = {
	name: 'config',
	description: 'Change la configuration de ce bot. Voici la liste des paramètres disponibles :\n`prefix` => Préfixe du bot\n`img` => Image du bot (embed)\n`name` => Nom du bot (embed)\n`color` => Couleur des messages\n`verifyChannel` => Id du salon textuel de vérification\n`roles [role]` => Liste des rôles dont voici la liste: \n>`admin` => Id rôle admin\n>`unverified` => Id rôle non-vérifié\n>`verified` => Id rôle vérifié\n>`ranks [rank]` => Liste des grades (`GD`,`HG`,`THG`,`GE`,`G`(Gouvernement),`A`(Admin))\n>`filials [filial]` => Liste des filières (`PN`,`CM`,`GN`,`CHU`,`R`,`AS`,`DA`,`J`,`ST`)',
	aliases: ['settings'],
	usage: '[paramètre] [valeur]',
	role: 'admin',
	args: true,
	execute(message, args) {
		// embed pre-config
		const embed = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTimestamp()
			.setFooter(config.name, config.img)
			.setAuthor(config.name, config.img);

		const newConfig = config;
		let param = '';
		let value = '';

		// Prevent changing the token
		if (args[0] == 'token') {
			embed.setColor('#FF0106')
				.setTitle('Erreur :')
				.setDescription('Le token ne peut pas être changé.');
			return message.channel.send(embed);
		}

		// Check if property exist
		if (args[0] == 'roles') {
			// config.roles
			if (config.roles.hasOwnProperty(args[1])) {
				if (args[1] == 'ranks') {
					// config.roles.ranks
					if (config.roles.ranks.hasOwnProperty(args[2])) {
						newConfig.roles.ranks[args[2]] = args[3];
						param = args[2];
						value = args[3];
					}
					else{
						embed.setColor('#FF0106')
							.setTitle('Erreur :')
							.setDescription('Paramètre invalide.');
						return message.channel.send(embed);
					}
				}
				else if (args[1] == 'filials') {
					// config.roles.filials
					if (config.roles.filials.hasOwnProperty(args[2])) {
						newConfig.roles.filials[args[2]] = args[3];
						param = args[2];
						value = args[3];
					}
					else{
						embed.setColor('#FF0106')
							.setTitle('Erreur :')
							.setDescription('Paramètre invalide.');
						return message.channel.send(embed);
					}
				}
				else{
					newConfig.roles[args[1]] = args[2];
					param = args[1];
					value = args[2];
				}
			}
			else {
				embed.setColor('#FF0106')
					.setTitle('Erreur :')
					.setDescription('Paramètre invalide.');
				return message.channel.send(embed);
			}
		}
		else{
			// config
			if (config.hasOwnProperty(args[0])) {
				newConfig[args[0]] = args[1];
				param = args[0];
				value = args[1];
			}
			else {
				embed.setColor('#FF0106')
					.setTitle('Erreur :')
					.setDescription('Paramètre invalide.');
				return message.channel.send(embed);
			}
		}

		try {
			const data = JSON.stringify(newConfig);
			fs.writeFileSync('./config.json', data);

			embed.setTitle('Succès !')
				.setDescription(`Le paramètre \`\`${param}\`\` a bien été changé en \`\`${value}\`\` !`);
			return message.channel.send(embed);
		}
		catch (e) {
			embed.setColor('#FF0106')
				.setTitle('Erreur lors du changement :')
				.setDescription(e);
			return message.channel.send(embed);
		}
	},
};
