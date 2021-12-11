console.log(`Welcome to SERVICE HANDLER /--/ By https://milrato.eu /--/ Discord: Tomato#6966`.yellow);
const PlayerMap = new Map()
const Discord = require(`discord.js`);
const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const { MessageButton, MessageActionRow, MessageEmbed } = require(`discord.js`);
const { check_if_dj } = require("./functions");
module.exports = (client) => {
        try {
            client.distube.on(`playSong`, async(queue, track) => {
                        client.guilds.cache.get(queue.id).me.voice.setDeaf(true).catch((e) => {})

                        try {
                            var newQueue = client.distube.getQueue(queue.id)
                            var newTrack = track;
                            var data = receiveQueueData(newQueue, newTrack)
                                //Send message with buttons
                            let currentSongPlayMsg = await queue.textChannel.send(data).then(msg => {
                                    PlayerMap.set(`currentmsg`, msg.id);
                                    return msg;
                                })
                                //create a collector for the thinggy
                            var collector = currentSongPlayMsg.createMessageComponentCollector({
                                filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
                                time: track.duration > 0 ? track.duration * 1000 : 600000
                            }); //collector for 5 seconds
                            //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
                            let lastEdited = false;


                            collector.on('collect', async i => {
                                        if (check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])) {
                                            return i.reply({
                                                embeds: [new MessageEmbed()
                                                    .setColor(ee.wrongcolor)
                                                    .setFooter(ee.footertext, ee.footericon)
                                                    .setTitle(` **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)
                                                    .setDescription(`**DJ Yetkisi:**\n${check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])}`)
                                                ],
                                                ephemeral: true
                                            });
                                        }
                                        lastEdited = true;
                                        setTimeout(() => {
                                                lastEdited = false
                                            }, 7000)
                                            //skip
                                        if (i.customId == `1`) {
                                            let { member } = i;
                                            //get the channel instance from the Member
                                            const { channel } = member.voice
                                                //if the member is not in a channel, return
                                            if (!channel)
                                                return i.reply({
                                                        content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                                                        ephemeral: true
                                                    })
                                                    //get the player instance
                                            const queue = client.distube.getQueue(i.guild.id);
                                            //if no player available return aka not playing anything
                                            if (!queue || !newQueue.songs || newQueue.songs.length == 0) {
                                                return i.reply({
                                                    content: ` Henüz Oynanan Bir Şey Yok`,
                                                    ephemeral: true
                                                })
                                            }
                                            //if not in the same channel as the player, return Error
                                            if (channel.id !== newQueue.voiceChannel.id)
                                                return i.reply({
                                                        content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                                                        ephemeral: true
                                                    })
                                                    //if ther is nothing more to skip then stop music and leave the Channel
                                            if (newQueue.songs.length == 0) {
                                                //if its on autoplay mode, then do autoplay before leaving...
                                                i.reply({
                                                        embeds: [new MessageEmbed()
                                                            .setColor(ee.color)
                                                            .setTimestamp()
                                                            .setTitle(`⏹ **Oynatmayı bıraktı ve Kanaldan ayrıldı**`)
                                                        ]
                                                    })
                                                    //edit the current song message
                                                await client.distube.stop(i.guild.id)
                                                return
                                            }
                                            //skip the track
                                            await client.distube.skip(i.guild.id)
                                            i.reply({
                                                embeds: [new MessageEmbed()
                                                    .setColor(ee.color)
                                                    .setTimestamp()
                                                    .setTitle(`⏭ **Bir sonraki Şarkıya atlandı!**`)
                                                    .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                                                ]
                                            })
                                        }
                                        //stop
                                        if (i.customId == `2`) {
                                            let { member } = i;
                                            //get the channel instance from the Member
                                            const { channel } = member.voice
                                                //if the member is not in a channel, return
                                            if (!channel)
                                                return i.reply({
                                                    content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                                                    ephemeral: true
                                                })

                                            //if not in the same channel as the player, return Error
                                            if (channel.id !== newQueue.voiceChannel.id)
                                                return i.reply({
                                                        content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                                                        ephemeral: true
                                                    })
                                                    //stop the track
                                            i.reply({
                                                    embeds: [new MessageEmbed()
                                                        .setColor(ee.color)
                                                        .setTimestamp()
                                                        .setTitle(`⏹ **Çalmayı bıraktı ve Kanaldan ayrıldı!**`)
                                                        .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                                                    ]
                                                })
                                                //edit the current song message
                                            await client.distube.stop(i.guild.id)
                                        }
                                        //pause/resume
                                        if (i.customId == `3`) {
                                            let { member } = i;
                                            //get the channel instance from the Member
                                            const { channel } = member.voice
                                                //if the member is not in a channel, return
                                            if (!channel)
                                                return i.reply({
                                                        content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                                                        ephemeral: true
                                                    })
                                                    //if not in the same channel as the player, return Error
                                            if (channel.id !== newQueue.voiceChannel.id)
                                                return i.reply({
                                                    content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                                                    ephemeral: true
                                                })
                                            if (newQueue.playing) {
                                                await client.distube.pause(i.guild.id);
                                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                                currentSongPlayMsg.edit(data).catch((e) => {
                                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                                })
                                                i.reply({
                                                    embeds: [new MessageEmbed()
                                                        .setColor(ee.color)
                                                        .setTimestamp()
                                                        .setTitle(`⏸ **Duraklatıldı!**`)
                                                        .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                                                    ]
                                                })
                                            } else {
                                                //pause the player
                                                await client.distube.resume(i.guild.id);
                                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                                currentSongPlayMsg.edit(data).catch((e) => {
                                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                                })
                                                i.reply({
                                                    embeds: [new MessageEmbed()
                                                        .setColor(ee.color)
                                                        .setTimestamp()
                                                        .setTitle(`▶️ **Devam ettirildi!**`)
                                                        .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                                                    ]
                                                })
                                            }
                                        }
                                        //Rewind
                                        if (i.customId == `4`) {
                                            let { member } = i;
                                            //get the channel instance from the Member
                                            const { channel } = member.voice
                                                //if the member is not in a channel, return
                                            if (!channel)
                                                return i.reply({
                                                        content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                                                        ephemeral: true
                                                    })
                                                    //if not in the same channel as the player, return Error
                                            if (channel.id !== newQueue.voiceChannel.id)
                                                return i.reply({
                                                    content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                                                    ephemeral: true
                                                })
                                            let seektime = newQueue.currentTime - 10;
                                            if (seektime < 0) seektime = 0;
                                            if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;
                                            await newQueue.seek(Number(seektime))
                                            collector.resetTimer({ time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000 })
                                            i.reply({
                                                embeds: [new MessageEmbed()
                                                    .setColor(ee.color)
                                                    .setTimestamp()
                                                    .setTitle(`⏪ **Şarkıyı \`10 Saniye\` için geri aldı!**`)
                                                    .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                                                ]
                                            })
                                            var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                            currentSongPlayMsg.edit(data).catch((e) => {
                                                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                            })
                                        }
                                        //Forward
                                        if (i.customId == `5`) {
                                            let { member } = i;
                                            //get the channel instance from the Member
                                            const { channel } = member.voice
                                                //if the member is not in a channel, return
                                            if (!channel)
                                                return i.reply({
                                                        content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                                                        ephemeral: true
                                                    })
                                                    //if not in the same channel as the player, return Error
                                            if (channel.id !== newQueue.voiceChannel.id)
                                                return i.reply({
                                                    content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                                                    ephemeral: true
                                                })
                                            let seektime = newQueue.currentTime + 10;
                                            if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;
                                            await newQueue.seek(Number(seektime))
                                            collector.resetTimer({ time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000 })
                                            i.reply({
                                                embeds: [new MessageEmbed()
                                                    .setColor(ee.color)
                                                    .setTimestamp()
                                                    .setTitle(`⏩ **Şarkıyı \`10 Saniye\` için iletti!**`)
                                                    .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                                                ]
                                            })
                                            var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                            currentSongPlayMsg.edit(data).catch((e) => {
                                                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                            })
                                        }
                                        //Shuffle
                                        if (i.customId == `6`) {
                                            let { member } = i;
                                            //get the channel instance from the Member
                                            const { channel } = member.voice
                                                //if the member is not in a channel, return
                                            if (!channel)
                                                return i.reply({
                                                        content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                                                        ephemeral: true
                                                    })
                                                    //if not in the same channel as the player, return Error
                                            if (channel.id !== newQueue.voiceChannel.id)
                                                return i.reply({
                                                        content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                                                        ephemeral: true
                                                    })
                                                    //pause the player
                                            await newQueue.shuffle()
                                                //Send Success Message
                                            i.reply({
                                                embeds: [new MessageEmbed()
                                                    .setColor(ee.color)
                                                    .setTimestamp()
                                                    .setTitle(`🔀 **${newQueue.songs.length} Şarkı Karıştırıldı!**`)
                                                    .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                                                ]
                                            })
                                        }
                                        //autoplay
                                        if (i.customId == `7`) {
                                            let { member } = i;
                                            //get the channel instance from the Member
                                            const { channel } = member.voice
                                                //if the member is not in a channel, return
                                            if (!channel)
                                                return i.reply({
                                                        content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                                                        ephemeral: true
                                                    })
                                                    //if not in the same channel as the player, return Error
                                            if (channel.id !== newQueue.voiceChannel.id)
                                                return i.reply({
                                                        content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                                                        ephemeral: true
                                                    })
                                                    //pause the player
                                            await newQueue.toggleAutoplay()
                                            if (newQueue.autoplay) {
                                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                                currentSongPlayMsg.edit(data).catch((e) => {
                                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                                })
                                            } else {
                                                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                                currentSongPlayMsg.edit(data).catch((e) => {
                                                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                                })
                                            }
                                            //Send Success Message
                                            i.reply({
                                                        embeds: [new MessageEmbed()
                                                                .setColor(ee.color)
                                                                .setTimestamp()
                                                                .setTitle(`${newQueue.autoplay ? `**Otomatik Oynatma Etkin**`: ` **Otomatik Oynatma Kaplı**`}`)
                    .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                  })
              }
              //Songloop
              if(i.customId == `8`){
                let { member } = i;
                //get the channel instance from the Member
                const { channel } = member.voice
                //if the member is not in a channel, return
                if (!channel)
                  return i.reply({
                    content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                    ephemeral: true
                  })
                //if not in the same channel as the player, return Error
                if (channel.id !== newQueue.voiceChannel.id)
                  return i.reply({
                    content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                    ephemeral: true
                  })
                //Disable the Repeatmode
                if(newQueue.repeatMode == 1){
                  await newQueue.setRepeatMode(0)
                } 
                //Enable it
                else {
                  await newQueue.setRepeatMode(1)
                }
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`${newQueue.repeatMode == 1 ? `**Şarkı Döngüsü Etkin**`: ` **Şarkı Döngüsü kapalı**`}`)
                    .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                })
                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }
              //Queueloop
              if(i.customId == `9`){
                let { member } = i;
                //get the channel instance from the Member
                const { channel } = member.voice
                //if the member is not in a channel, return
                if (!channel)
                  return i.reply({
                    content: ` **Lütfen önce bir Ses Kanalına katılın!**`,
                    ephemeral: true
                  })
                //if not in the same channel as the player, return Error
                if (channel.id !== newQueue.voiceChannel.id)
                  return i.reply({
                    content: ` **Lütfen önce __benim__ Ses Kanalıma katılın! <#${channel.id}>**`,
                    ephemeral: true
                  })
                //Disable the Repeatmode
                if(newQueue.repeatMode == 2){
                  await newQueue.setRepeatMode(0)
                } 
                //Enable it
                else {
                  await newQueue.setRepeatMode(2)
                }
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`${newQueue.repeatMode == 2 ? `**Liste Döngüsü Etkin **`: ` **Liste Döngüsü Kapalı **`}`)
                    .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                  })
                var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }
              


            });
          } catch (error) {
            console.error(error)
          }
    });
    client.distube.on(`addSong`, (queue, song) => queue.textChannel.send({
      embeds: [
        new MessageEmbed()
        .setColor(ee.color)
        .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
        .setFooter("💯 " + song.user.tag, song.user.displayAvatarURL({
          dynamic: true
        }))
        .setTitle(`**Şarkı listeye eklendi!**`)
        .setDescription(`👍 Şarkı: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
        .addField(`🌀 **Şarkı süresi:**`, `\`${song.formattedDuration}\``)
      ]
    }));
    client.distube.on(`addList`, (queue, playlist) => queue.textChannel.send({
      embeds: [
        new MessageEmbed()
        .setColor(ee.color)
        .setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`)
        .setFooter("💯" + playlist.user.tag, playlist.user.displayAvatarURL({
          dynamic: true
        }))
        .setTitle(`**Oynatma listesi Listeye eklendi!**`)
        .setDescription(`👍 Oynatma listesi: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length} Şarkı\``)
        .addField(`🌀 **Şarkı süresi:**`, `\`${playlist.formattedDuration}\``)
      ]
    }));

    client.distube.on(`error`, (channel, e) => {
      channel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
        currentSongPlayMsg.delete().catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }).catch((e) => {
        //console.log(e.stack ? String(e.stack).grey : String(e).grey)
      })
      channel.send(`Bir hatayla karşılaşıldı: ${e}`).catch((e)=>console.log(e))
      console.error(e)
    });
    client.distube.on(`empty`, queue => {
      queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
        currentSongPlayMsg.delete().catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }).catch((e) => {
        //console.log(e.stack ? String(e.stack).grey : String(e).grey)
      })
      var embed = new MessageEmbed()
      .setColor(ee.color)
      .setFooter(ee.footertext, ee.footericon)
      .setTitle("⛔️ KANALDAN AYRILDI")
      .setDescription(":headphones: **Başka şarkı kalmadı**")
      .setTimestamp()
      queue.textChannel.send({embeds: [embed]})
    });
    client.distube.on(`searchNoResult`, message => {
      message.channel.send(`Aradıgınız Şarkı Bulunamadı`).catch((e)=>console.log(e))
    })
    client.distube.on(`finishSong`, (queue, song) => {
      queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
        currentSongPlayMsg.delete().catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }).catch((e) => {
        //console.log(e.stack ? String(e.stack).grey : String(e).grey)
      })
    });
    client.distube.on(`finish`, queue => {
      queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
        currentSongPlayMsg.delete().catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }).catch((e) => {
        //console.log(e.stack ? String(e.stack).grey : String(e).grey)
      })
      queue.textChannel.send({
        embeds: [
          new MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon)
          .setTitle("⛔️ KANALDAN AYRILDI")
          .setDescription(":headphones: **Başka şarkı kalmadı**")
          .setTimestamp()
        ]
      })
    });
    client.distube.on(`initQueue`, queue => {
      try {
        client.settings.ensure(queue.id, {
          defaultvolume: 50,
          defaultautoplay: false,
          defaultfilters: [`bassboost6`, `clear`]
        })
        let data = client.settings.get(queue.id)
        queue.autoplay = Boolean(data.defaultautoplay);
        queue.volume = Number(data.defaultvolume);
        queue.setFilter(data.defaultfilters);
      } catch (error) {
        console.error(error)
      }
    });
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }

  function receiveQueueData(newQueue, newTrack) {
    var djs = client.settings.get(newQueue.id, `djroles`);
    if(!djs || !Array.isArray(djs)) djs = [];
    else djs = djs.map(r => `<@&${r}>`);
    if(djs.length == 0 ) djs = "`not setup`";
    else djs.slice(0, 15).join(", ");
    if(!newTrack) return new MessageEmbed().setColor(ee.wrongcolor).setTitle("NO SONG FOUND?!?!")
    var embed = new MessageEmbed()
      .setColor(ee.color)
      .addField(`💡 İsteyen`, `>>> ${newTrack.user}`, true)
      .addField(`⏱ Süre:`, `>>> \` ${newTrack.formattedDuration}\``, true)
      .addField(`🌀 Şarkı Listesi:`, `>>> \`${newQueue.songs.length} şarkı\`\n\`${newQueue.formattedDuration}\``, true)
      .addField(`🔊 Ses Seviyesi:`, `>>> \`${newQueue.volume} %\``, true)
      .addField(`❔ Şarkıyı indir:`, `>>> [\`Buraya Tıkla\`](${newTrack.streamURL})`, true)
      .addField(`❔ Filtreler:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : ``}`, newQueue.filters.length > 2 ? false : true)
			.addField(`🎧 DJ Yetkisi: `, `>>> ${djs}`, client.settings.get(newQueue.id, "djroles").length > 1 ? false : true)
      .setAuthor(`${newTrack.name}`, `https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif`, newTrack.url)
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
      .setFooter(`💯 ${newTrack.user.tag}`, newTrack.user.displayAvatarURL({
        dynamic: true
      }));
    let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`)
    let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`⏹`)
    let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('⏸')
    let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('4').setEmoji('⏪').setLabel(`-10`)
    let forward = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('⏩').setLabel(`+10`)
    if (!newQueue.playing) {
      pause = pause.setStyle('SUCCESS').setEmoji('▶️')
    }
    let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('6').setEmoji('🔀').setLabel(`Rastgele`)
    let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji('🔄').setLabel(`Otomatik Otnatma`)
    let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('8').setEmoji(`🔁`).setLabel(`Tekrarlama`)
    let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('9').setEmoji(`🔂`).setLabel(`Listesi Tekrarlama`)
    if (newQueue.autoplay) {
      autoplay = autoplay.setStyle('SECONDARY')
    }
    if (newQueue.repeatMode === 0) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 1) {
      songloop = songloop.setStyle('SECONDARY')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 2) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SECONDARY')
    }
    if (Math.floor(newQueue.currentTime) < 10) {
      rewind = rewind.setDisabled()
    } else {
      rewind = rewind.setDisabled(false)
    }
    if (Math.floor((newTrack.duration - newQueue.currentTime)) <= 10) {
      forward = forward.setDisabled()
    } else {
      forward = forward.setDisabled(false)
    }
    const row = new MessageActionRow().addComponents([skip, stop, pause, rewind, forward]);
    const row2 = new MessageActionRow().addComponents([ shuffle,songloop, queueloop,autoplay]);
    return {
      embeds: [embed],
      components: [row, row2]
    };
  }
};