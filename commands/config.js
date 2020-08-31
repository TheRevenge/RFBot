const Discord = require('discord.js');
const config = require('../config.json');
const beautify = require('js-beautify').js;
const fs = require('fs');

module.exports = {
	name: 'config',
	description: 'Change la configuration de ce bot. Voici la liste des paramètres disponibles :\n`prefix` => Préfixe du bot\n`img` => Image du bot (embed)\n`name` => Nom du bot (embed)\n`color` => Couleur des messages\n`verifyChannel` => Id du salon textuel de vérification\n`roles [role]` => Liste des rôles dont voici la liste: \n>`admin` => Id rôle admin\n>`unverified` => Id rôle non-vérifié\n>`verified` => Id rôle vérifié\n>`ranks [rank]` => Liste des grades (`VIP`,`REC (Recrue)`,`GD`,`HG`,`THG`,`GE`,`G`(Gouvernement),`P`(Président),`A`(Admin),`AG`(Ancien Gradé),`AHG`(Ancien HG),`ATHG`(Ancien THG),`AGE`(Ancien Gradé Expert),`R`(Retraité),`C`(Citoyen),`DA`,`J`,`ST`,`AS`)\n>`filials [filial]` => Liste des filières (`PN`,`CM`,`GN`,`CHU`,`R`,`AS`)',
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

		switch (args[0]) {
		// case 'token':
		// 	embed.setColor('#FF0106')
		// 		.setTitle('Erreur :')
		// 		.setDescription('Le token ne peut pas être changé.');
		// 	return message.channel.send(embed);
		// 	break;
		case 'list':
			embed.setTitle('Configuration actuelle :')
				.setDescription(`\`\`\`json\n ${beautify(JSON.stringify(newConfig), { indent_size: 2, space_in_empty_paren: true })} \`\`\``);
			return message.channel.send(embed);
			break;
		case 'roles':
		// config.roles
			if (config.roles.hasOwnProperty(args[1])) {
				switch (args[1]) {
				case 'ranks':
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
					break;
				case 'filials':
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
					break;
				default:
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
			break;
		default:
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
				.setColor('#00FE23')
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
