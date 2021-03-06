module.exports = {
  name: 'listroles',
  permission: 1,
  main: function(bot, msg) {
      msg.channel.send({embed: {
          color: 3447003,
          author: {
            name: "List of Self-Assignable Roles",
            icon_url: msg.guild.iconURL
          },
          title: "Use 'j!addrole' and 'j!removerole' to add/remove roles from yourself.",
          description: "DM an admin if you have any role suggestions!",
          fields: [{
              name: "Color Roles",
              value: "These roles do not grant access to any chats, but do change your username color. The available roles are: Light blue, dark blue, orange, yellow, blurple, purple, green, peach, pink, and red."
            },
            {
              name: "VC",
              value: "This role does not grant access to any chats, but it will be pinged when voice chat calls start."
            },
            {
              name: "Teen That Cares™",
              value: "Grants access to our #teens-that-care chat; this role is not mentionable."
            },
            {
              name: "Movie-goers",
              value: "Grants access to our Cinema 7 category; this role is not mentionable."
            },
            {
              name: "Academia",
              value: "Grants access to our #academia chat; this role is mentionable."
            },
            {
              name: "Aesthetic",
              value: "Grants access to our #aesthetic chat; this role is not mentionable."
            },
            {
              name: "Coders",
              value: "Grants access to our #coding chat; this role is not mentionable."
            },
            {
              name: "Floofs",
              value: "Grants access to our #floofs chat; this role is not mentionable."
            },
            {
              name: "News",
              value: "Does not grant access to any new chats; this role will be mentioned when an update is pushed to #world-news."
            }
          ],
          footer: {
            icon_url: msg.guild.iconURL
          }
        }
      });
  }
};