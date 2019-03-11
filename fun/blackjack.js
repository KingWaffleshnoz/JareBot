module.exports = {
    name: "blackjack",
    permission: 1,
      //functions
      restart(player_hand, cpu_hand, cards) {
        player_hand.push(this.drawCard(cards));
        cpu_hand.push(this.drawCard(cards));
        player_hand.push(this.drawCard(cards));
      },
    
      drawCard(cards) {
        let i = Math.floor(Math.random() * cards.length);
        return cards.splice(i, 1)[0];
      },
    
      calculateTotal(hand) {
        let total = 0;
        for (var i = 0; i < hand.length; i++) {
          if (hand[i] == "J" || hand[i] == "Q" || hand[i] == "K") {
            total += 10;
          } else if (hand[i] == "A") {
            total += 11;
          } else {
            total += hand[i];
          }
        }
    
        for (var i = 0; i < hand.length; i++) {
          if (hand[i] == "A" && total > 21) {
            total -= 10;
          }
        }
        return total;
      },
    
      beepboop(player_hand, cpu_hand, cards) {
        let player_total = this.calculateTotal(player_hand);
        while (
          this.calculateTotal(cpu_hand) <= player_total &&
          this.calculateTotal(cpu_hand) < 21
        ) {
          cpu_hand.push(this.drawCard(cards));
        }
        let cpu_total = this.calculateTotal(cpu_hand);
        if (cpu_total > 21 || cpu_total <= player_total) {
          if (
            cpu_total == player_total &&
            player_hand.length > cpu_hand.length
          ) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      },

      //async loop (exit needed?)
      async main(bot, msg) {
      //variables
        var bet;
        var cards = [
          "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K",
          "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K",
          "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K",
          "A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"
        ];
        var player_hand = [];
        var cpu_hand = [];
        var timeout = true;
      
      //initial bet
        if (msg.args[0] && isNaN(msg.args[0])) { 
          bet = 10;
        }
        else if (msg.args[0] && !isNaN(msg.args[0]) && Number(msg.args[0]) > 0) {
          bet = Number(msg.args[0]);
        }
        else {
          bet = 10;
        }

        if (bot.bank[msg.author.id].balance.toFixed(2) < bet) {
          msg.channel.send("You frickin' foolian juulian, you don't have enough money to cover your bet!")
          return;
        }
  
      //set table
      this.restart(player_hand, cpu_hand, cards);
        let blackjackMessage = await msg.channel.send({
          embed: {
            color: 0x33cc33,
            title: "♠️♥️**Blackjack Bet: $" + bet + "**♦️♣️",
            description:
              "Dealer's hand: " +
              cpu_hand +
              "\n؜" +
              "Player's hand: "+
              player_hand +
              "\n" + "\n" +
              "React with 👆 to hit or ✋ to stand!",
            footer: {
              text: "Classic Blackjack",
              icon_url: msg.author.avatarURL
            },
            timestamp: new Date()
          }
        })
        .then(async function (message) {
          await message.react("👆")
          await message.react("✋")
          return message;
        });

        let filter = (reaction, user) =>
        (reaction.emoji.name === "👆" || reaction.emoji.name === "✋") &&
        user.id === msg.author.id;

        //play table
        let collector = blackjackMessage.createReactionCollector(filter, {
          time: 1000 * 3 * 60
        });

        //on stand & dealer bust
        collector.on("collect", messageReaction => {
          if (messageReaction.emoji.name === "✋") {
            if (this.beepboop(player_hand, cpu_hand, cards)) {
              blackjackMessage.edit({
                embed: {
                  color: 0x33cc33,
                  title: "♠️♥️**Blackjack Bet: $" + bet + "**♦️♣️",
                  description:
                    "Dealer's hand: " +
                    cpu_hand +
                    "\n؜" +
                    "Player's hand: "+
                    player_hand +
                    "\n" + "\n" +
                    "Dealer busts, you have won $" + bet + "!",
                  footer: {
                    text: "Classic Blackjack",
                    icon_url: msg.author.avatarURL
                  },
                  timestamp: new Date()
                }
              });
              //give money
              bot.bank[msg.author.id].balance += bet;

              } else {
              //dealer win
              blackjackMessage.edit({
                embed: {
                  color: 0x33cc33,
                  title: "♠️♥️**Blackjack Bet: $" + bet + "**♦️♣️",
                  description:
                    "Dealer's hand: " +
                    cpu_hand +
                    "\n؜" +
                    "Player's hand: "+
                    player_hand +
                    "\n" + "\n" +
                    "Dealer wins, you have lost $" + bet + "!",
                  footer: {
                    text: "Classic Blackjack",
                    icon_url: msg.author.avatarURL
                  },
                  timestamp: new Date()
                }
              });
              //take money
              bot.bank[msg.author.id].balance -= bet;
            }
            timeout = false;
            collector.stop();
          
          //on hit & dealer win
          } else if (messageReaction.emoji.name === "👆") {
            player_hand.push(this.drawCard(cards));
            if (this.calculateTotal(player_hand) > 21) {
              blackjackMessage.edit({
                embed: {
                  color: 0x33cc33,
                  title: "♠️♥️**Blackjack Bet: $" + bet + "**♦️♣️",
                  description:
                    "Dealer's hand: " +
                    cpu_hand +
                    "\n؜" +
                    "Player's hand: "+
                    player_hand +
                    "\n" + "\n" +
                    "Player busts, you have lost $" + bet + "!",
                  footer: {
                    text: "Classic Blackjack",
                    icon_url: msg.author.avatarURL
                  },
                  timestamp: new Date()
                }
              });
              //take money
              bot.bank[msg.author.id].balance -= bet;

              timeout = false;
              collector.stop();


            } else {
              blackjackMessage.edit({
                embed: {
                  color: 0x33cc33,
                  title: "♠️♥️**Blackjack Bet: $" + bet + "**♦️♣️",
                  description:
                    "Dealer's hand: " +
                    cpu_hand +
                    "\n؜" +
                    "Player's hand: "+
                    player_hand +
                    "\n" + "\n" +
                    "React with 👆 to hit or ✋ to stand!",
                  footer: {
                    text: "Classic Blackjack",
                    icon_url: msg.author.avatarURL
                  },
                  timestamp: new Date()
                }
              });
            }
          }
          let me = messageReaction.users
            .filter(user => user.username == msg.author.username)
            .first();
          messageReaction.remove(me);
        });
        collector.on("end", collected => {
          if (timeout) {
            blackjackMessage.edit({
              embed: {
                color: 0x33cc33,
                title: "♠️♥️**Blackjack Bet: $" + bet + "**♦️♣️",
                description: "Session timed out.",
                footer: {
                  text: "Classic Blackjack",
                  icon_url: msg.author.avatarURL
                },
                timestamp: new Date()
              }
            });
          }
        });
      }
    }