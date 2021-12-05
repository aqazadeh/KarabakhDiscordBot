console.log(`Welcome to SERVICE HANDLER /--/ By https://milrato.eu /--/ Discord: Tomato#6966`.yellow);
const PlayerMap = new Map()
const Discord = require(`discord.js`);
const config = require(`../botconfig/config.json`);
const ee = require(`../botconfig/embed.json`);
const {
    MessageButton,
    MessageActionRow,
    MessageEmbed
} = require(`discord.js`);
const {
    check_if_dj
} = require("./functions");
let songEditInterval = null;
module.exports = (client) => {
        try {
            client.distube
                .on(`playSong`, async(queue, track) => {
                        try {
                            client.guilds.cache.get(queue.id).me.voice.setDeaf(true).catch((e) => {
                                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            })
                        } catch (error) {
                            console.log(error)
                        }
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

                            /**
                             * @INFORMATION - EDIT THE SONG MESSAGE EVERY 10 SECONDS!
                             */
                            try { clearInterval(songEditInterval) } catch (e) {}
                            songEditInterval = setInterval(async() => {
                                if (!lastEdited) {
                                    try {
                                        var newQueue = client.distube.getQueue(queue.id)
                                        var newTrack = newQueue.songs[0];
                                        var data = receiveQueueData(newQueue, newTrack)
                                        await currentSongPlayMsg.edit(data).catch((e) => {
                                            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                        })
                                    } catch (e) {
                                        clearInterval(songEditInterval)
                                    }
                                }
                            }, 10000)

                            collector.on('collect', async i => {
                                        if (i.customId != `10` && check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])) {
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
                                                clearInterval(songEditInterval);
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
                                            clearInterval(songEditInterval);
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
                                        //autoplay
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
            //Shuffle
            if(i.customId == `5`){
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
                  .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              })
            }
            //Songloop
            if(i.customId == `6`){
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
            if(i.customId == `7`){
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
                  .setTitle(`${newQueue.repeatMode == 2 ? `**Kuyruk Döngüsü Etkin **`: ` **Kuyruk Döngüsü Kapalı **`}`)
                  .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                })
              var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Forward
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
              let seektime = newQueue.currentTime + 10;
              if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏩ **Şarkıyı \`10 Saniye\` için iletti!**`)
                  .setFooter(`💢 Eylem yapan: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              })
              var data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Rewind
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
              let seektime = newQueue.currentTime - 10;
              if (seektime < 0) seektime = 0;
              if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏪ **Şarkıyı \`10 Saniye\` için geri aldı!**`)
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
      })
      .on(`addSong`, (queue, song) => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
          .setFooter("💯 " + song.user.tag, song.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`**Şarkı Kuyruğa eklendi!**`)
          .setDescription(`👍 Şarkı: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
          .addField(`⌛ **Tahmini süresi:**`, `\`${queue.songs.length - 1} Şarkı\` - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
          .addField(`🌀 **Şarkı süresi:**`, `\`${queue.formattedDuration}\``)
        ]
      }))
      .on(`addList`, (queue, playlist) => queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`)
          .setFooter("💯" + playlist.user.tag, playlist.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`**Oynatma listesi Kuyruğa eklendi!**`)
          .setDescription(`👍 Oynatma listesi: [\`${playlist.name}\`](${playlist.url ? playlist.url : ""})  -  \`${playlist.songs.length} Song${playlist.songs.length > 0 ? "s" : ""}\``)
          .addField(`⌛ **Tahmini süresi:**`, `\`Şarkı\` - \`${(Math.floor((queue.duration - playlist.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
          .addField(`🌀 **Şarkı süresi:**`, `\`${queue.formattedDuration}\``)
        ]
      }))
      // DisTubeOptions.searchSongs = true
      .on(`searchResult`, (message, result) => {
        let i = 0
        message.channel.send(`**Aşağıdan bir seçenek belirleyin**\n${result.map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join(`\n`)}\n*Başka bir şey girin veya iptal etmek için 60 saniye bekleyin*`)
      })
      // DisTubeOptions.searchSongs = true
      .on(`searchCancel`, message => message.channel.send(`Mesaj İptal edildi`).catch((e)=>console.log(e)))
      .on(`error`, (channel, e) => {
        channel.send(`Bir hatayla karşılaşıldı: ${e}`).catch((e)=>console.log(e))
        console.error(e)
      })
      .on(`empty`, queue => {
        var embed = new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle("⛔️ KANALDAN AYRILDI")
        .setDescription(":headphones: **Başka şarkı kalmadı**")
        .setTimestamp()
        queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
          currentSongPlayMsg.edit({embeds: [embed], components: []}).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      })
      .on(`searchNoResult`, message => message.channel.send(`Aradıgınız Şarkı Bulunamadı`).catch((e)=>console.log(e)))
      .on(`finishSong`, (queue, song) => {
        var embed = new MessageEmbed().setColor(ee.color)
        .setAuthor(`${song.name}`, "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png", song.url)
        .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
        .setFooter(`💯 ${song.user.tag}\n⛔️ Şarkı Bitti!`, song.user.displayAvatarURL({
          dynamic: true
        }));
        queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
          currentSongPlayMsg.edit({embeds: [embed], components: []}).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      })
      .on(`finish`, queue => {
        queue.textChannel.send({
          embeds: [
            new MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon)
            .setTitle("⛔️ KANALDAN AYRILDI")
            .setDescription(":headphones: **Başka şarkı kalmadı**")
            .setTimestamp()
          ]
        })
      })
      .on(`initQueue`, queue => {
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
    var embed = new MessageEmbed().setColor(ee.color)
      .addField(`💡 İsteyen`, `>>> ${newTrack.user}`, true)
      .addField(`⏱ Süre:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
      .addField(`🌀 Şarkı Kuyruğu:`, `>>> \`${newQueue.songs.length} şarkı\`\n\`${newQueue.formattedDuration}\``, true)
      .addField(`🔊 Ses Seviyesi:`, `>>> \`${newQueue.volume} %\``, true)
      .addField(`♾ Tekrarlama:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `\` Kuyruk\`` : `\`Şarkı\`` : ``}`, true)
      .addField(`❔ Şarkıyı indir:`, `>>> [\`Buraya Tıkla\`](${newTrack.streamURL})`, true)
      .addField(`❔ Filtre${newQueue.filters.length > 0 ? "ler": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : ``}`, newQueue.filters.length > 1 ? false : true)
			.addField(`🎧 DJ-Role${client.settings.get(newQueue.id, "djroles").length > 1 ? "s": ""}:`, `>>> ${djs}`, client.settings.get(newQueue.id, "djroles").length > 1 ? false : true)
      .setAuthor(`${newTrack.name}`, `https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif`, newTrack.url)
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
      .setFooter(`💯 ${newTrack.user.tag}`, newTrack.user.displayAvatarURL({
        dynamic: true
      }));
    let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`).setLabel(`Geç`)
    let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`🏠`).setLabel(`Dur`)
    let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('⏸').setLabel(`Duraklat`)
    let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('4').setEmoji('🔁').setLabel(`Otomatik Oynatma`)
    let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('🔀').setLabel(`Rastgele oynat`)
    if (!newQueue.playing) {
      pause = pause.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Devam`)
    }
    if (newQueue.autoplay) {
      autoplay = autoplay.setStyle('SECONDARY')
    }
    let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji(`🔁`).setLabel(`Şarkı`)
    let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`🔂`).setLabel(`Şarkı Kuyruğu`)
    let forward = new MessageButton().setStyle('PRIMARY').setCustomId('8').setEmoji('⏩').setLabel(`+10 Saniye`)
    let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('9').setEmoji('⏪').setLabel(`-10 Saniye`)
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
    const row = new MessageActionRow().addComponents([skip, stop, pause, autoplay, shuffle]);
    const row2 = new MessageActionRow().addComponents([songloop, queueloop, forward, rewind]);
    return {
      embeds: [embed],
      components: [row, row2]
    };
  }
};