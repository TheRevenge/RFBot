const Discord = require('discord.js');
const config = require('../config.json');
const axios = require('axios').default;

module.exports = {
	name: 'verify',
	description: 'Permet à un arrivant de se vérifier (en cas d\'un premier échec)',
	execute(msg) {
		const guildMember = msg.member;
		const channel = msg.channel;

		const embded = new Discord.MessageEmbed()
			.setColor(config.color)
			.setTimestamp()
			.setFooter(config.name, config.img)
			.setAuthor(config.name, config.img);

		if(guildMember.roles.cache.some(role => role.id === config.roles.verified)) {
			embded.setColor('#FF0106')
				.setTitle('Oops !')
				.setDescription('Tu es déjà vérifié !');
			return channel.send(embded);
		}

		/* eslint-disable max-nested-callbacks */
		const unverifiedRole = msg.guild.roles.cache.find(r => r.id === config.roles.unverified);
		guildMember.roles.add(unverifiedRole);

		const toRemove = [];

		function reset() {
			toRemove.forEach((messageId) => {
				channel.messages.fetch(messageId)
					.then(message => {
						message.delete();
					});
			});
		}

		toRemove.push(msg.id);

		embded.setTitle('Début de la vérification')
			.setDescription('Donne-moi ton nom sur habbo afin de te vérifier. Tu as 1 minute pour répondre.');
		channel.send(embded)
			.then(message => {
				toRemove.push(message.id);

				message.channel.awaitMessages(m => m.author.id === guildMember.id, {
					max: 1,
					time: 60000,
					errors: ['time'],
				})
					.then(function(collected) {
						toRemove.push(collected.first().id);
						const gameUsername = collected.first().content;
						axios.get('https://www.habbo.fr/api/public/users?name=' + gameUsername)
							.then(response => { // eslint-disable-line no-unused-vars

								// Generating code
								const length = 3;
								let code = '';
								const characters = '0123456789';
								const charactersLength = characters.length;
								for (let i = 0; i < length; i++) {
									code += characters.charAt(Math.floor(Math.random() * charactersLength));
								}
								code = '#RF' + code;

								embded.setTitle('Deuxième étape')
									.setDescription(`Mets ceci à la fin de ton humeur : \`\`${code}\`\` \nQuand c'est fait, clique sur la réaction :white_check_mark:. Tu as 5 minutes pour réagir.`);
								channel.send(embded)
									.then(message2 => {
										message2.react('✅');

										toRemove.push(message2.id);

										const filter2 = (reaction, user) => {
											return reaction.emoji.name === '✅' && user.id === guildMember.id;
										};

										message2.awaitReactions(filter2, {
											max: 1,
											time: 300000,
											errors: ['time'],
										})
											.then(() => {
												// Fetch the in-game motto
												axios.get('https://www.habbo.fr/api/public/users?name=' + gameUsername)
													.then(response2 => {
														// JSON responses are automatically parsed.
														if (response2.data.motto.indexOf(code) > -1) {

															guildMember.setNickname(gameUsername);

															axios.get('https://www.habbo.fr/api/public/users/' + response2.data.uniqueId + '/profile')
																.then(data => {
																	const ranks = config.roles.ranks;
																	const filials = config.roles.filials;
																	let role = '';

																	data.data.groups.forEach(function(group) {
																		switch (group.id) {
																		// VIP
																		case 'g-hhfr-e91735dbd8340a304a80d5590c32fd23':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.VIP);
																			guildMember.roles.add(role);
																			break;
																		// Recrue PN,CM,GN,CHU,Resto
																		case 'g-hhfr-04a3080c14a40250bf5d169b56186c6f':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.REC);
																			guildMember.roles.add(role);
																			break;
																		case 'g-hhfr-86cc3fce1be56495b490434e9a801fb4':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.REC);
																			guildMember.roles.add(role);
																			break;
																		case 'g-hhfr-f724f4e0cd385825ef7245c83690302b':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.REC);
																			guildMember.roles.add(role);
																			break;
																		case 'g-hhfr-7eaee7cafa1e88a4c2a3b80bdc5952ba':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.REC);
																			guildMember.roles.add(role);
																			break;
																		case 'g-hhfr-4050526c64bc359368597bcef634d94f':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.REC);
																			guildMember.roles.add(role);
																			break;
																		// GD
																		case 'g-hhfr-9495b4e7b9c093c9a4414de96e2714e1':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.GD);
																			guildMember.roles.add(role);
																			break;
																			// BG
																		case 'g-hhfr-52311da472fdbec754d9c7aafa64a06c':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.BG);
																			guildMember.roles.add(role);
																			break;
																			// HG
																		case 'g-hhfr-6a09545457e8f05f5704547fe8b56801':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.HG);
																			guildMember.roles.add(role);
																			break;
																			// THG
																		case 'g-hhfr-ddaea77adf6d662bc2738a6151651f63':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.THG);
																			guildMember.roles.add(role);
																			break;
																			// GE
																		case 'g-hhfr-38e3f87342f5945ef73b73a46c6e83c1':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.GE);
																			guildMember.roles.add(role);
																			break;
																			// G
																		case 'g-hhfr-6130266dd6f5dc9ae3ffce13bbecefed':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.G);
																			guildMember.roles.add(role);
																			break;
																			// P
																		case 'g-hhfr-a564dd041fd8d39d4a1acffdd1348f7b':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.P);
																			guildMember.roles.add(role);
																			break;
																			// A
																		case 'g-hhfr-6c04bedf61777e2cee2c2e90dd72ac3f':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.A);
																			guildMember.roles.add(role);
																			break;
																			// Old officer (Ancien Gradé)
																		case 'g-hhfr-2e537dd6392bc63ee74a8402b3bf612e':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.AG);
																			guildMember.roles.add(role);
																			break;
																			// R
																		case 'g-hhfr-ed5f341cdb08fd351747fefec7d4cbea':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.R);
																			guildMember.roles.add(role);
																			break;
																			// AS
																		case 'g-hhfr-31795d94cc7f959b39d73e50b179a58e':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.AS);
																			guildMember.roles.add(role);

																			role = guildMember.guild.roles.cache.find(r => r.id === filials.AS);
																			guildMember.roles.add(role);
																			break;
																			// ST
																		case 'g-hhfr-91e2362218d22fc1abd5824482fb1319':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.ST);
																			guildMember.roles.add(role);
																			break;
																			// DA
																		case 'g-hhfr-667698dd9d020235251732a4e0df3c7f':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.DA);
																			guildMember.roles.add(role);
																			break;
																			// J
																		case 'g-hhfr-e6f24e7f8ad2da1772156223a5a6f1b2':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.J);
																			guildMember.roles.add(role);
																			break;
																			// Citizen
																		case 'g-hhfr-6212ac32a1d173740afd63a67af245c7':
																			role = guildMember.guild.roles.cache.find(r => r.id === ranks.C);
																			guildMember.roles.add(role);
																			break;
																		default:

																		}
																	});
																	// If has no HQ
																	if (guildMember.roles.cache.some(r => r.id === ranks.AG) && !guildMember.roles.cache.some(r => r.id === ranks.GD) || guildMember.roles.cache.some(r => r.id === ranks.R) && !guildMember.roles.cache.some(r => r.id === ranks.GD) || guildMember.roles.cache.some(r => r.id === ranks.AS) || guildMember.roles.cache.some(r => r.id === ranks.DA) || guildMember.roles.cache.some(r => r.id === ranks.ST) || guildMember.roles.cache.some(r => r.id === ranks.J) || guildMember.roles.cache.some(r => r.id === ranks.A) || guildMember.roles.cache.some(r => r.id === ranks.P) || guildMember.roles.cache.some(r => r.id === ranks.VIP)) {
																		embded.setTitle('Succès !')
																			.setColor('#00FE23')
																			.setDescription('Ton compte a bien été vérifié, tu vas bientôt recevoir tes rôles !');
																		channel.send(embded)
																			.then(message3 => {
																				toRemove.push(message3.id);

																				setTimeout(() => {
																					guildMember.roles.remove(config.roles.unverified);
																					guildMember.roles.add(config.roles.verified);
																					reset();
																				}, 3000);
																			});
																	}
																	else {
																		embded.setTitle('Dernière étape')
																			.setDescription('Donne-moi le nom de ta filière selon le format suivant :\n Police Nationale => `PN`\n Centre Militaire => `CM`\n Gendarmerie Nationale => `GN`\n Restaurant => `R`\n Hôpital => `CHU`\n Tu as 1 minute pour répondre.');
																		channel.send(embded)
																			.then(message3 => {

																				toRemove.push(message3.id);

																				message3.channel.awaitMessages(m => m.author.id === guildMember.id, {
																					max: 1,
																					time: 60000,
																					errors: ['time'],
																				}).then(collected2 => {

																					toRemove.push(collected2.first().id);

																					switch (collected2.first().content) {
																					case 'PN':
																						role = guildMember.guild.roles.cache.find(r => r.id === filials.PN);
																						guildMember.roles.add(role);
																						break;
																					case 'CM':
																						role = guildMember.guild.roles.cache.find(r => r.id === filials.CM);
																						guildMember.roles.add(role);
																						break;
																					case 'GN':
																						role = guildMember.guild.roles.cache.find(r => r.id === filials.GN);
																						guildMember.roles.add(role);
																						break;
																					case 'CHU':
																						role = guildMember.guild.roles.cache.find(r => r.id === filials.CHU);
																						guildMember.roles.add(role);
																						break;
																					case 'R':
																						role = guildMember.guild.roles.cache.find(r => r.id === filials.R);
																						guildMember.roles.add(role);
																						break;
																					default:
																						embded.setColor('#FF0106')
																							.setTitle('Oops !')
																							.setDescription('Tu as mal écrit le code de ta filière, recommence !');
																						guildMember.send(embded);
																						reset();
																					}

																					embded.setTitle('Succès !')
																						.setColor('#00FE23')
																						.setDescription('Ton compte a bien été vérifié, tu vas bientôt recevoir tes rôles ');
																					channel.send(embded)
																						.then(message4 => {
																							toRemove.push(message4.id);

																							setTimeout(() => {
																								guildMember.roles.remove(config.roles.unverified);
																								guildMember.roles.add(config.roles.verified);
																								reset();
																							}, 3000);
																						});
																				});

																			}).catch(() => {
																				embded.setColor('#FF0106')
																					.setTitle('Oops !')
																					.setDescription('Tu as été trop lent pour donner ta filière, recommence !');
																				guildMember.send(embded);
																				reset();
																			});
																	}
																});
														}
														else {
															embded.setColor('#FF0106')
																.setTitle('Oops !')
																.setDescription('Le code est incorrect, recommence !');
															guildMember.send(embded);
															reset();
														}
													});
											})
											.catch(collected3 => {
												if (collected3) return;
												embded.setColor('#FF0106')
													.setTitle('Oops !')
													.setDescription('Tu as été trop lent pour la vérification !');
												guildMember.send(embded);

												reset();
											});
									});
							})
							.catch(e => {
								embded.setColor('#FF0106')
									.setTitle('Oops !')
									.setDescription(`T'es trompé dans ton pseudo ! (${e})`);
								guildMember.send(embded);
								reset();
							});
					})
					.catch(() => {
						embded.setColor('#FF0106')
							.setTitle('Oops !')
							.setDescription('Tu as été trop lent pour la vérification !');
						guildMember.send(embded);
						reset();
					});
			});

		/* eslint-enable max-nested-callbacks */

	},
};
