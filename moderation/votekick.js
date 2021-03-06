module.exports = {
    name: 'votekick',
    permission: 1,
    main: async function (bot, msg) {
        if (msg.mentions.users.first()) {
            //grab target
            var target = msg.mentions.members.first();

            //count votes
            var yes = 0;
            var no = 0;

            //grab reason
            var reason = msg.content.split(' ').splice(1).join(' ');
            if (reason === '') {
                reason = 'no reason given'
            };

            if (target.voice.channel) {
                let vcCount = target.voice.channel.members.size;
                var threshold = Math.floor(vcCount / 2);

                let vote = await msg.channel.send({
                    embed: {
                        color: 3447003,
                        title: msg.author.username + " wants to call a vote:",
                        description:
                            "Kick player: " +
                            target.user.username +
                            "?\n؜" +
                            "(" + reason + ")\n" +
                            "React 👍 to vote YES" +
                            "\n" +
                            "React 👎 to vote NO",
                        footer: {
                            text: "Vote count:",
                        }
                    }
                })

                await vote.react("👍")
                await vote.react("👎")

                let collector = vote.createReactionCollector((reaction, user) =>
                    (reaction.emoji.name === "👍" || reaction.emoji.name === "👎"), {
                    time: 1000 * 2 * 60
                });

                collector.on("collect", async messageReaction => {
                    if (messageReaction.emoji.name === "👍") {
                        yes++;
                        if (yes > threshold) {
                            vote.edit({
                                embed: {
                                    color: 3447003,
                                    title: msg.author.username + " wants to call a vote:",
                                    description:
                                        "Kick player: " +
                                        target.user.username +
                                        "?\n؜" +
                                        "(" + reason + ")\n" +
                                        "**Vote passed!**",
                                    footer: {
                                        text: "Vote count:",
                                    }
                                }
                            });
                            target.voice.setChannel(null)
                            collector.stop();
                        }
                    } else if (messageReaction.emoji.name === "👎") {
                        no++;
                        if (no > threshold) {
                            vote.edit({
                                embed: {
                                    color: 3447003,
                                    title: msg.author.username + " wants to call a vote:",
                                    description:
                                        "Kick player: " +
                                        target.user.username +
                                        "?\n؜" +
                                        "(" + reason + ")\n" +
                                        "**Vote failed!**",
                                    footer: {
                                        text: "Vote count:",
                                    }
                                }
                            });
                            collector.stop();
                        }
                    }
                });

                collector.on("end", async collected => {
                    if (yes > no) {
                        vote.edit({
                            embed: {
                                color: 3447003,
                                title: msg.author.username + " wants to call a vote:",
                                description:
                                    "Kick player: " +
                                    target.user.username +
                                    "?\n؜" +
                                    "(" + reason + ")\n" +
                                    "**Vote passed!**",
                                footer: {
                                    text: "Vote count:",
                                }
                            }
                        });
                        target.voice.setChannel(null)
                        collector.stop();
                    } else {
                        vote.edit({
                            embed: {
                                color: 3447003,
                                title: msg.author.username + " wants to call a vote:",
                                description:
                                    "Kick player: " +
                                    target.user.username +
                                    "?\n؜" +
                                    "(" + reason + ")\n" +
                                    "**Vote failed!**",
                                footer: {
                                    text: "Vote count:",
                                }
                            }
                        });
                    }
                });
            } else if (!target.voice.channel) {
                msg.reply("cannot kick a disconnected user!");
            } else {
                msg.reply("something went wrong!")
            }
        } else {
            msg.reply("mention someone!");
        }
    }
};