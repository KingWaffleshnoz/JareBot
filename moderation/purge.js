module.exports = {
	name: 'purge',
	permission: 2,
	main: function (bot, msg) {
		const yup = bot.emojis.cache.find(emoji => emoji.name == "yup").toString();
		if (msg.member.hasPermission('MANAGE_MESSAGES') || msg.author.id === require("../config.json").owner) {
			var num = msg.content;
			if (!isNaN(num)) {
				msg.channel.messages.fetch({ limit: num })
					.then(messages => msg.channel.bulkDelete(messages))
					.catch(msg.channel.bulkDelete);

				msg.channel.send(yup + " | Purged " + num + " messages!\nhttps://i.imgur.com/SSiOqrl.gif")

			} else {
				msg.channel.send("Please specify a number!");
			}
		}
	}
};