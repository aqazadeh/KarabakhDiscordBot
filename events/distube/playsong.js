const { check_if_not_dj, receiveQueueData, Embed } = require("../../handlers/functions");
module.exports = client => {
        try {
            client.distube.on(`playSong`, async(queue, track) => {
                        client.guilds.cache.get(queue.id).me.voice.setDeaf(true).catch((e) => {});
                        try {

                            const newQueue = client.distube.getQueue(queue.id);
                            const newTrack = track;
                            const data = receiveQueueData(newQueue, newTrack);
                            let currentSongPlayMsg = await queue.textChannel.send(data).then(msg => {
                                client.PlayerMap.set(queue.id, msg.id);
                                return msg;
                            });
                            const collector = currentSongPlayMsg.createMessageComponentCollector({
                                filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
                                time: track.duration > 0 ? track.duration * 1000 : 600000
                            });
                            collector.on('collect', async i => {

                                const { member } = i;
                                const { channel } = member.voice;

                                let setting = await client.db.findOne({ where: { guild_id: i.guild.id } });
                                if (setting == null) {
                                    setting = await client.db.create({ guild_id: i.guild.id})
                                }
                                        if (check_if_not_dj(client, member, client.distube.getQueue(i.guild.id).songs[0], setting)) {
                                            return i.message.channel.send({
                                                embeds: [Embed("error", member.user.tag, member.user.displayAvatarURL(), `❌ **Siz bir DJ veya Şarkı İsteyen değilsiniz!**`)]
                                            }).then(msg => {
                                                setTimeout(() => {
                                                    msg.delete().catch((e) => { console.log(String(e).grey) });
                                                }, 5000);
                                            })
                                        }
                                        if (!channel) {
                                            return queue.textChannel.send({
                                                embeds: [Embed("error", member.user.tag, member.user.displayAvatarURL(), `❌ **Lütfen önce ses kanalına giriş yapın**`)]
                                            }).then(msg => {
                                                setTimeout(() => {
                                                    msg.delete().catch((e) => { console.log(String(e).grey) });
                                                }, 5000);
                                            });
                                        }
                                        const queue = client.distube.getQueue(i.guild.id);
                                        if (!queue || !newQueue.songs || newQueue.songs.length == 0) {
                                            return queue.textChannel.send({
                                                embeds: [Embed("error", member.user.tag, member.user.displayAvatarURL(), `❌ **Şuan şarkı çalmıyorum!**`)]
                                            }).then(msg => {
                                                setTimeout(() => {
                                                    msg.delete().catch((e) => { console.log(String(e).grey) });
                                                }, 5000);
                                            })
                                        }
                                        if (channel.id !== newQueue.voiceChannel.id) {
                                            return queue.textChannel.send({
                                                embeds: [Embed("error", member.user.tag, member.user.displayAvatarURL(), `❌ **Benim ses Kanalıma giriş yap! Lütfen** <#${channel.id}> **kanalına giriş yap!**`)]
                                            }).then(msg => {
                                                setTimeout(() => {
                                                    msg.delete().catch((e) => { console.log(String(e).grey) });
                                                }, 5000);
                                            });
                                        }

                                        //skip
                                        if (i.customId == `skip`) {
                                            await client.distube.skip(i.guild.id)
                                                .then(() => {
                                                    return queue.textChannel.send({
                                                        embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `⏩ **Bir sonraki şarkıya geçiş yapıldı!`)]
                                                    }).then(msg => {
                                                        setTimeout(() => {
                                                            msg.delete().catch((e) => { console.log(String(e).grey) });
                                                        }, 5000);
                                                    })
                                                })
                                                .catch(() => {
                                                    return queue.textChannel.send({
                                                        embeds: [Embed("error", member.user.tag, member.user.displayAvatarURL(), `❌ **Listede Baska Şarkı yok! Sıradaki şarkıya geçilemedi!**`)]
                                                    }).then(msg => {
                                                        setTimeout(() => {
                                                            msg.delete().catch((e) => { console.log(String(e).grey) });
                                                        }, 5000);
                                                    })
                                                })
                                        }
                                        //stop
                                        if (i.customId == `stop`) {

                                            await client.distube.stop(i.guild.id).then(() => {
                                                currentSongPlayMsg.delete().catch((e) => {
                                                    console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                                });
                                                return queue.textChannel.send({
                                                    embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `⏹ **Şarkı başarılı bir şekilde durduruldu!**`)]
                                                }).then(msg => {
                                                    setTimeout(() => {
                                                        msg.delete().catch((e) => { console.log(String(e).grey) });
                                                    }, 5000);
                                                });
                                            });
                                        }
                                        //pause/resume
                                        if (i.customId == `pause`) {
                                            if (newQueue.playing) {
                                                await client.distube.pause(i.guild.id);
                                                const data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0]);
                                                currentSongPlayMsg.edit(data).catch((e) => {
                                                    console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                                });
                                                return queue.textChannel.send({
                                                    embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `⏸ **Şarkı başarılı bir şekilde duraklatıldı!**`)]
                                                }).then(msg => {
                                                    setTimeout(() => {
                                                        msg.delete().catch((e) => { console.log(String(e).grey) });
                                                    }, 5000);
                                                });
                                            } else {
                                                await client.distube.resume(i.guild.id);
                                                const data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                                currentSongPlayMsg.edit(data).catch((e) => {
                                                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                                });

                                                return queue.textChannel.send({
                                                    embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `▶️ **Şarkı başarılı bir şekilde devam ettirildi!**`)]
                                                }).then(msg => {
                                                    setTimeout(() => {
                                                        msg.delete().catch((e) => { console.log(String(e).grey) });
                                                    }, 5000);
                                                });
                                            }
                                        }
                                        //prev                                        
                                        if (i.customId == `prev`) {
                                            await client.distube.previous(i.guild.id)
                                                .then(() => {
                                                    return queue.textChannel.send({
                                                        embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `⏪ **Bir önceki şarkıya geçiş yapıldı!`)]
                                                    }).then(msg => {
                                                        setTimeout(() => {
                                                            msg.delete().catch((e) => { console.log(String(e).grey) });
                                                        }, 5000)
                                                    });
                                                })
                                                .catch(() => {
                                                    return queue.textChannel.send({
                                                        embeds: [Embed("error", member.user.tag, member.user.displayAvatarURL(), `❌ **Listede önceki Şarkı yok! Önceki şarkıya geçilemedi!**`)]
                                                    }).then(msg => {
                                                        setTimeout(() => {
                                                            msg.delete().catch((e) => { console.log(String(e).grey) });
                                                        }, 5000);
                                                    });
                                                });
                                        }
                                        //Shuffle
                                        if (i.customId == `shuffle`) {
                                            await newQueue.shuffle().then(() => {
                                                return queue.textChannel.send({
                                                    embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `🔀 **Şarkı sıralaması karıştırıldı!`)]
                                                }).then(msg => {
                                                    setTimeout(() => {
                                                        msg.delete().catch((e) => { console.log(String(e).grey) })
                                                    }, 5000)
                                                })
                                            });
                                        }
                                        //autoplay
                                        if (i.customId == `autoplay`) {
                                            await newQueue.toggleAutoplay();
                                            const data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0]);
                                            currentSongPlayMsg.edit(data).catch((e) => {
                                                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                            });
                                            return queue.textChannel.send({
                                                        embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `✅ **Otomatik Oyntma ${newQueue.autoplay ? `Açık` : ` Kapalı`}!**`)]
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch((e) => { console.log(String(e).grey) });
                                    }, 5000);
                                });
                            }
                            //Songloop
                            if(i.customId == `songloop`){
                                if(newQueue.repeatMode == 1){
                                    await newQueue.setRepeatMode(0);
                                } 
                                else {
                                    await newQueue.setRepeatMode(1);
                                }
                                
                                const data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0]);
                                currentSongPlayMsg.edit(data).catch((e) => {
                                    console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                });
                                return queue.textChannel.send({
                                    embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `✅ **Şarkı döngüsü ${newQueue.repeatMode == 1 ? ` Etkinleştirildi`: `Kapatıldı`}**`)]
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch((e) => { console.log(String(e).grey) });
                                    }, 5000);
                                });
                            }
                            //Queueloop
                            if(i.customId == `queueloop`){
                                if(newQueue.repeatMode == 2){
                                    await newQueue.setRepeatMode(0);
                                } 
                                else {
                                    await newQueue.setRepeatMode(2);
                                }
                                const data = receiveQueueData(client.distube.getQueue(queue.id), newQueue.songs[0])
                                currentSongPlayMsg.edit(data).catch((e) => {
                                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                                });
                                return queue.textChannel.send({
                                    embeds: [Embed("success", member.user.tag, member.user.displayAvatarURL(), `✅ **Liste döngüsü ${newQueue.repeatMode == 1 ? ` Etkinleştirildi`: `Kapatıldı`}**`)]
                                }).then(msg => {
                                    setTimeout(() => {
                                        msg.delete().catch((e) => { console.log(String(e).grey) });
                                    }, 5000);
                                });
                            }

                        });
                    } catch (error) {
                        console.error(error)
                }
            });

    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}