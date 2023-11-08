const Discord = require("discord.js");
const mongoose = require("mongoose");
const client = new Discord.Client();
const config = require("./config.json");
const schedule = require('node-schedule');


mongoose.connect('mongodb://localhost/concord_tracker');
mongoose.Promise = global.Promise;

const MemberSchema = new mongoose.Schema({
    name: {type: String, required: true},
    points: {type: Number, required: true}
});

const QueueSchema = new mongoose.Schema({
    name: {type: String, required: true},
    method: {type: String, required: true},
    event: String
}, {timestamps: true});

const CapSchema = new mongoose.Schema({
    name: {type: String, required: true}
}, {timestamps: true});

mongoose.model('Member', MemberSchema);
var Member = mongoose.model('Member');

mongoose.model("Queue", QueueSchema);
var Queue = mongoose.model("Queue");

mongoose.model("Cap", CapSchema);
var Cap = mongoose.model("Cap");

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const stars = {
    small : {
        1 : 74.7, 2 : 81.9, 3 : 91.8, 4 : 100.8, 5 : 111.6, 6 : 124.2, 7 : 135.9, 8 : 151.2, 9 : 166.5, 10 : 183.6, 11 : 203.4, 12 : 224.1, 13 : 246.6, 14 : 273.6, 15 : 313.9, 16 : 328, 17 : 328, 18 : 341.9, 19 : 356.8, 20 : 371.8, 21 : 388.6, 22 : 404.1, 23 : 421.9, 24: 440.3, 25 : 459.1, 26 : 478.5, 27 : 499.6, 28 : 520.7, 29 : 543.1, 30 : 566.7, 31 : 591.1, 32 : 616.3, 33 : 643, 34 : 671, 35 : 699.6, 36 : 729.7, 37 : 761.7, 38 : 794.2, 39 : 829.3, 40 : 864.4, 41 : 902.2, 42 : 940.9, 43 : 981.3, 44 : 1023.7, 45 : 1067.8, 46 : 1114.5, 47 : 1164.2, 48 : 1214.7, 49 : 1266, 50 : 1321.2, 51 : 1377.7, 52 : 1439.6, 53 : 1499.2, 54 : 1565.4, 55 : 1634.3, 56 : 1706.3, 57 : 1781.9, 58 : 1854.9, 59 : 1939.2, 60 : 2021.1, 61 : 2108.5, 62 : 2202.6, 63 : 2293.5, 64 : 2404.9, 65 : 2500.6, 66 : 2605.7, 67 : 2722.7, 68 : 2854.8, 69 : 2964, 70 : 3111.2, 71 : 3231.4, 72 : 3371, 73 : 3535.7, 74 : 3698.3, 75 : 3856.3, 76 : 4007.2, 77 : 4193.8, 78 : 4375.9, 79 : 4550.5, 80 : 4776, 81 : 4999.1, 82 : 5217, 83 : 5426.1, 84 : 5714.4, 85 : 5902.1, 86 : 6179.3,87 : 6450.4, 88 : 6710.9, 89 : 7107, 90 : 7345.8, 91 : 7741.8, 92 : 7937, 93 : 8313.8, 94 : 8683, 95 : 9038.9, 96 : 9677.3, 97 : 10016.8, 98 : 10322.2, 99 : 10322.2
    },
    medium : {
        
    },
    large : {
        1 : 300, 2 : 331.2, 3 : 369.6, 4 : 408, 5 : 447.6, 6 : 499.2, 7 : 590.4, 8 : 609.6, 9 : 932.4, 10 : 736.8, 11 : 816, 12 : 902.4, 13 : 986.4, 14 : 1099.2, 15 : 1209.6, 16 : 1255.2, 17 : 1315.2, 18 : 1368, 19 : 1430.4, 20 : 1488, 21 : 1557.6, 22 : 1617.6, 23 : 1689.6, 24 : 1764, 25 : 1843.2, 26 : 1915.2, 27 : 1945.2, 28 : 1987.2, 29 : 2174.4, 30 : 2270.4, 31 : 2367.6, 32 : 2467.2, 33 : 2572.8, 34 : 2684.4, 35 : 2798.4, 36 : 2920.8, 37 : 3048, 38 : 3177.6, 39 : 3319.2, 40 : 3458.4, 41 : 3609.6, 42 : 3765.6, 43 : 3926.4, 44 : 4096.8, 45 : 4269.6, 46 : 4459.2, 47 : 4658.4, 48 : 4860, 49 : 5064, 50 : 5284.8, 51 : 5511.6, 52 : 5760, 53 : 5997.6, 54 : 6261.6, 55 : 6537.6, 56 : 6825.6, 57 : 7128, 58 : 7420.8, 59 : 7759.2, 60 : 8084.4, 61 : 8436, 62 : 8810.4, 63 : 9174, 64 : 9621.6, 65 : 10118.4, 66 : 10423.2, 67 : 10891.2, 68 : 11419.2, 69 : 11856, 70 : 12445.2, 71 : 12926.4, 72 : 13484.4, 73 : 14143.2, 74 : 14793.6, 75 : 15426, 76 : 16029.6, 77 : 16776, 78 : 17504.4, 79 : 18202.8, 80 : 19104, 81 : 19996.8, 82 : 20868, 83 : 21704.4, 84 : 22857.6, 85 : 23608.8, 86 : 24158.4, 87 : 25802.4, 88 : 26844, 89 : 28428, 90 : 29383.2, 91 : 30967.2, 92 : 31749.6, 93 : 33256.8, 94 : 34732.8, 95 : 36156, 96 : 38709.6, 97 : 40068, 98 : 41289.6, 99 : 41289.6
    },
    huge : {
        1 : 598.8, 2 : 734.4, 3 : 739.2, 4 : 816, 5 : 895.2 , 6 : 998.4 , 7 : 1180.8, 8 : 1219.2, 9 : 1370.4, 10 : 1473.6, 11 : 1632, 12 : 1804.8, 13 : 1974, 14 : 2198.4, 15 : 2419.2, 16 : 2511.6, 17 : 2630.4, 18 : 2736, 19 : 2860.8, 20 : 2976, 21 : 3115.2, 22 : 3235.2, 23 : 3379.2, 24 : 3528, 25 : 3685.2, 26 : 3830.4, 27 : 3997.2, 28 : 3974.4, 29 : 4348.8, 30 : 4540.8, 31 : 4735.2, 32 : 4934.4, 33 : 5145.6, 34 : 4954.8, 35 : 5596.8, 36 : 5846.4, 37 : 6096, 38 : 6355.2, 39 : 6638.4, 40 : 6916.8, 41 : 7219.2, 42 : 7531.2, 43 : 7852.8, 44 : 8193.6, 45 : 8539.2, 46 : 8918.4, 47 : 9316.8, 48 : 9720, 49 : 10128, 50 : 10569.6, 51 : 11022, 52 : 11520, 53 : 11995.2, 54 : 12523.2, 55 : 13075.2, 56 : 13651.2, 57 : 14255.5, 58 : 14841.6, 59 : 15518.4, 60 : 16168.8, 61 : 16872, 62 : 17620.8, 63 : 18348, 64 : 19243.2, 65 : 20236.8, 66 : 20846.4, 67 : 21782.4, 68 : 22838.4, 69 : 23712, 70 : 24889.2, 71 : 25851.6, 72 : 26968.8, 73 : 28286.4, 74 : 29588.4, 75 : 30850.8, 76 : 32059.2, 77 : 33552, 78 : 35007.6, 79 : 36405.6, 80 : 38208, 81 : 39993.6, 82 : 41736, 83 : 43408.8, 84 : 45716.4, 85 : 47216.4, 86 : 49435.2, 87 : 51603.6, 88 : 53686.8, 89 : 56856, 90 : 58766.4, 91 : 61934.4, 92 : 63499.2, 93 : 66513.6, 94 : 69464.4, 95 : 72312, 96 : 77419.2, 97 : 80136, 98 : 82578, 99 : 82578
    }
}

for(let i = 1; i < 100; i++) {
    stars.medium[i] = stars.small[i] * 2;
}

var j = schedule.scheduleJob({hour: 13, minute: 0, dayOfWeek: 2}, function(){
    Cap.remove({}, error => {
        if(error) {
            console.log("Error, could not clear caplist.");
        } else {
            console.log("Cleared caplist for the week.");
        }
    });
});

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
    if(message.author.bot) return;
    
    if(message.content.indexOf(config.prefix) !== 0) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    function helpCommand() {
        if(message.member.roles.some(r=>["Concord Keys"].includes(r.name)) == true) {
            const embed = new Discord.RichEmbed()
            .setTitle("Hi " + message.member.user.username + "!")
            .setColor(3447003)
            .setThumbnail("https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
            .setDescription("You are a Concord Key, so your commands are:")
            .setFooter("Powered by Concord - Developed by Kristo", "https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
            .setTimestamp()
            .addField("!concord (cap/recruit/host/attend) name", "Names cannot contain spaces.")
            .addField("!concord (add) (name) (amount)", "Names cannot contain spaces.")
            .addField("!concord (update) (old name) (new name)", "Names cannot contain spaces.")
            .addField("!concord (remove) (name) (amount)", "Names cannot contain spaces. Removes specified rank points.")
            .addField("!concord (destroy) (name)", "Permanently removes member from Concord database.")
            .addField("!concord (queue)", "Shows you the list of members on the queue list.")
            .addField("!concord (queue) (remove) (name)", "Removes entry from queue list.")
            .addField("!concord", "To see list of all members and their points.")
            .addField("!concord (rank) (name)", "Check a members rank and points to next rank.");
            return message.channel.send({embed});
        } else {
            const embed = new Discord.RichEmbed()
            .setTitle("Hi " + message.member.user.username + "!")
            .setThumbnail("https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
            .setColor(3447003)
            .setDescription("Here are the member commands:")
            .setFooter("Powered by Concord - Developed by Kristo", "https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
            .setTimestamp()
            .addField("!concord", "To see list of all members and their points.")
            .addField("!concord (rank) (name)", "Check a members rank and points to next rank.");
            return message.channel.send({embed});
        }
    }
  
    if(command === "concord") {
        if(message.channel.name === "concordranktracker" || message.channel.name === "keys-chat") {
            var points = {
                cap: 150,
                recruit: 50,
                host: 60,
                attend: 30
            }
            if(args[0] === "cap" || args[0] === "recruit" || args[0] === "host" || args[0] === "attend") {
                if(!message.member.roles.some(r=>["Concord Keys"].includes(r.name)) )
                  return message.reply("Sorry, you need to be a Concord Key to add ranking points! If you want to add yourself to the queue list, please go to #rankings.");
                if(args[2]) {
                    return message.channel.send("Invalid format! Example: '!concord cap TheGe' (Names cannot contain spaces)");
                }
                var name = capitalize(args[1]);
                Member.findOne({name: name}, (error, member) => {
                    if(!member) {
                        var m = "Member " + name + " does not exist in the Concord database. Adding now...\n"
                        Member.create({name: name, points: points[args[0]]});
                        m += "Success! Added " + name + "!";
                        Cap.create({name: name});
                        Queue.findOneAndRemove({name: name}, (error, qMember) => {
                            if(!qMember) {
                                m += name + " was not on the queue list.\n";
                            } else {
                                m += name + " was automagically removed from the queue list.\n";
                            }
                        });
                        message.channel.send(m);
                    } else {
                        if(args[0] === "cap") {
                            Cap.findOne({name: member.name}, (error, cMember) => {
                                if(!cMember) {
                                    Cap.create({name: member.name});
                                    member.points += points[args[0]];
                                    member.save();
                                    var m = "";
                                    Queue.findOneAndRemove({name: member.name}, (error, qMember) => {
                                        if(!qMember) {
                                            m += member.name + " was not on the queue list.\n";
                                        } else {
                                            m += member.name + " was automagically removed from the queue list.\n";
                                        }
                                    });
                                    m += "Updated " + member.name + "'s points. " + member.name + " now has " + member.points + " points!"
                                    return message.channel.send(m);
                                } else {
                                    return message.channel.send(member.name + " has already capped this week!");
                                }
                            });
                        } else {
                            member.points += points[args[0]];
                            member.save();
                            var m = "";
                            Queue.findOneAndRemove({name: member.name}, (error, qMember) => {
                                if(!qMember) {
                                    m += member.name + " was not on the queue list.\n";
                                } else {
                                    m += member.name + " was automagically removed from the queue list.\n";
                                }
                            });
                            m += "Updated " + member.name + "'s points. " + member.name + " now has " + member.points + " points!"
                            message.channel.send(m);
                        }
                    }
                });
            } else if (args[0] === "caplist") {
                if(!message.member.roles.some(r=>["Concord Keys"].includes(r.name)) )
                    return message.reply("Sorry, you need to be a Concord Key to view the queue list!");

                Cap.find({}, (error, members) => {
                    if(members === undefined || members.length == 0) {
                        return message.channel.send("Oops! No members in the caplist!");
                    }                    
                    var m = "";
                    m += "Concord's Current Weeks Caplist\n";
                    m += "---------------------------------------------------------------------------------------------------------\n"
                    for(let i = 0; i < members.length; i++) {
                        m += i + 1 + ". Member: " + members[i].name + "\n";
                    }
                    m += "---------------------------------------------------------------------------------------------------------\n";
                    message.channel.send(m);

                });
            } else if (args[0] === "add") {
                if(!message.member.roles.some(r=>["Concord Keys"].includes(r.name)) )
                    return message.reply("Sorry, you need to be a Concord Key to add ranking points!");

                if(!args[2]) {
                    return message.channel.send("Invalid format! Example: '!concord add jimmy 200' (Names cannot contain spaces)");
                }
                var name = capitalize(args[1]);
                var num = Number(args[2]);
                if(isNaN(num)) {
                    return message.channel.send("Invalid format! Example: '!concord add zezima 100' (This adds specified points from inputed member)");
                }
                Member.findOne({name: name}, (error, member) => {
                    if(!member) {
                        var m = "Member " + name + " does not exist in the Concord database. Adding now...\n"
                        Member.create({name: name, points: num});
                        m += "Success! Added " + name + "!";
                        message.channel.send(m);
                    } else {
                        member.points += num;
                        member.save();
                        message.channel.send("Added " + num + " points to " + member.name + ". " + member.name + " now has " + member.points + " points!");
                    }
                });
            } else if (args[0] === "update") {
                if(!message.member.roles.some(r=>["Concord Keys"].includes(r.name)) )
                    return message.reply("Sorry, you need to be a Concord Key to change a members name!");

                if(args.length > 3) {
                    return message.channel.send("Invalid format! Example: '!concord update 0cool 0lame' (Names cannot contain spaces)");
                }

                var name = capitalize(args[1]);
                var changedName = capitalize(args[2]);

                Member.findOne({name: name}, (error, member) => {
                    if(!member) {
                        return message.channel.send("Invalid member name!");
                    } else {
                        member.name = changedName;
                        member.save();
                        return message.channel.send("Member " + name + "'s name has been changed to " + member.name + " successfully.");
                    }
                })
            } else if (args[0] === "queue") {
                if(!message.member.roles.some(r=>["Concord Keys"].includes(r.name)) )
                    return message.reply("Sorry, you need to be a Concord Key to view the queue list!");

                if(args[1] === "remove") {
                    if(!args[2]) {
                        return message.channel.send("Invalid format! Example: '!concord queue remove 0cool'");
                    }
                    var name = capitalize(args[2]);
                    Queue.findOneAndRemove({name: name}, (error, member) => {
                        if(!member) {
                            return message.channel.send("Member does not exist in the queue list!");
                        } else {
                            return message.channel.send("Entry successfully removed from the queue list");
                        }
                    });
                } else {
                    Queue.find({}, (error, members) => {
                        if(members == undefined || members.length == 0) {
                            return message.channel.send("Oops! No members in the queue list!");
                        } else {
                            var embed = new Discord.RichEmbed()
                            .setTitle("Concord Rankings Queue List")
                            .setColor(3447003)
                            .setThumbnail("https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
                            .setFooter("Powered by Concord - Developed by Kristo", "https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
                            .setTimestamp()
                            for (let i = 0; i < members.length; i++) {
                                var event = "";
                                if (members[i].event) {
                                    event = " | Event Name: " + members[i].event;
                                }
                                embed.addField(i + 1 + ". Member: " + members[i].name + " | Method: " + members[i].method, "Date: " + members[i].createdAt.toDateString() + event);
                            }
                            return message.channel.send({embed})
                        }
                    });
                }
            } else if (args[0] === "destroy") {
                if(!message.member.roles.some(r=>["Concord Keys"].includes(r.name)) )
                    return message.reply("Sorry, you need to be a Concord Key to add ranking points!");

                if(args[2]) {
                    return message.channel.send("Invalid format! Example: '!concord destroy zezima' (This removes a member from the database ENTIRELY)");
                }
                var name = capitalize(args[1]);
                Member.findOneAndRemove({name: name}, (error, member) => {
                    if(!member) {
                        return message.channel.send("Invalid member name!");
                    } else {
                        return message.channel.send(member.name + " has been removed from the Concord database.");
                    }
                });
            } else if(args[0] === "rank") {
                var name = capitalize(args[1]);
                Member.findOne({name: name}, (error, member) => {
                    if(!member) {
                        message.channel.send("Member does not exist in the Concord database! Talk to a Concord Key to get you added!");
                    } else {
                        var embed = new Discord.RichEmbed()
                        .setTitle(name + "'s Concord Rank")
                        .setColor(3447003)
                        .setThumbnail("https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
                        .setFooter("Powered by Concord - Developed by Kristo", "https://cdn.discordapp.com/attachments/441431467218698262/441431551834587136/Peace-Concord-Signs-Symbols-Free-Vector-Graphics-F-5772.png")
                        .setTimestamp();
                        var rank = "";
                        var points = "";
                        if(member.points < 200) {
                            rank = "Rank: Recruit";
                            const num = 200 - member.points;
                            points = "Points needed for Corporal: " + num;
                        } else if(member.points >= 200 && member.points < 600) {
                            rank = "Rank: Corporal";
                            const num = 600 - member.points;
                            points = "Points needed for Sergeant: " + num ;
                        } else if(member.points >= 600 && member.points < 1000) {
                            rank = "Rank: Sergeant";
                            const num = 1000 - member.points;
                            points = "Points needed for Lieutenant: " + num;
                        } else if(member.points >= 1000 && member.points < 1800) {
                            rank = "Rank: Lieutenant";
                            const num = 1800 - member.points;
                            points = "Points needed for Captain: " + num;
                        } else if(member.points >= 1800 && member.points < 3000) {
                            rank = "Rank: Captain";
                            const num = 3000 - member.points;
                            points = "Points needed for General: " + num;
                        } else {
                            rank = "Rank: General";
                            points = "Contact Concord Key to apply for Admin.";
                        }
                        embed.addField(rank + " | Points: " + member.points, points);
                        message.channel.send({embed})
                    }
                });
            } else if (args[0] === "remove") {
                if(!message.member.roles.some(r=>["Concord Keys"].includes(r.name)) )
                    return message.reply("Sorry, you need to be a Concord Key to add ranking points!");

                const num = Number(args[2]);
                if(isNaN(num)) {
                    return message.channel.send("Invalid format! Example: '!concord remove zezima 100' (This removes specified points from inputed member)");
                }
                var name = capitalize(args[1]);
                Member.findOne({name: name}, (error, member) => {
                    if(!member) {
                        message.channel.send("Member does not exist in the Concord database!");
                    } else {
                        member.points -= num;
                        member.save();
                        message.channel.send("Removed " + num + " points from " + member.name + ". " + member.name + " now has " + member.points + " points!");
                    }
                });
            } else if (!args[0]) {
                Member.find({}, (error, members) => {
                    if(members === undefined || members.length == 0) {
                        return message.channel.send("Oops! No members in the Concord database!");
                    }
                    var m = "";
                    m += "Concord Ranking Point System\n";
                    m += "---------------------------------------------------------------------------------------------------------\n"
                    for(let i = 0; i < members.length; i++) {
                        m += "# Member: " + members[i].name + " | Points: " + members[i].points;
                        if(members[i].points < 200) {
                            m += " | Rank: Recruit #\n";
                        } else if(members[i].points >= 200 && members[i].points < 600) {
                            m += " | Rank: Corporal #\n";
                        } else if(members[i].points >= 600 && members[i].points < 1000) {
                            m += " | Rank: Sergeant #\n";
                        } else if(members[i].points >= 1000 && members[i].points < 1800) {
                            m += " | Rank: Lieutenant #\n";
                        } else if(members[i].points >= 1800 && members[i].points < 3000) {
                            m += " | Rank: Captain #\n";
                        } else {
                            m += " | Rank: General #\n";
                        }
                    }
                    m += "---------------------------------------------------------------------------------------------------------\n";
                    message.channel.send(m);
                });
            } else if (args[0] === "help") {
                helpCommand();
            } else {
                helpCommand();
            }
        } else if (message.channel.name === "rankings") {
            if(args[0] === "cap" || args[0] === "recruit" || args[0] === "host" || args[0] === "attend") {
                var name = capitalize(args[1]);
                Queue.findOne({name: name}, (error, member) => {
                    if(!member) {
                        Queue.create({name: name, method: args[0]});
                        return message.channel.send("Success. Added " + name + " to the queue list for " + args[0] + "ing!");
                    } else {
                        if (member.method === args[0]) {
                            return message.channel.send("You are already on the queue list for " + args[0] + "ing.");
                        } else {
                            if(args[0] === "cap" && args[2]) {
                                return message.channel.send("Invalid format! Example: '!concord cap TheGe' (Names cannot contain spaces)");
                            } else if (args[0] === "cap" && !args[2]) {
                                Queue.create({name: name, method: args[0]});
                                return message.channel.send("Success. Added " + name + " to the queue list for " + args[0] + "ping!")
                            } else {
                                if(!args[2]) {
                                    return message.channel.send("Invalid format! Example: '!concord recruit 0cool Zezima' (Names cannot contain spaces)");
                                } else {
                                    Queue.create({name: name, method: args[0], event: args[2]});
                                    return message.channel.send("Success. Added " + name + " to the queue list for " + args[0] + "ing!");
                                }
                            }
                        }
                    }
                });
            } else {
                helpCommand();
            }
        } else {
            message.reply("Must use ConcordRankTracker in the #concordranktracker or #rankings channels!");
        }
    }
    if(command === "thanks") {
        if(message.channel.name === "concordranktracker" || message.channel.name === "rankings") {
            message.reply("My pleasure!");
        } else {
            message.reply("Must use ConcordRankTracker in the #concordranktracker or #rankings channels!");
        }
    }

    if (command === "star") {
        if(message.channel.name === "bot-channel") {
            if(args[0] === "small" || args[0] === "medium" || args[0] === "large" || args[0] === "huge") {
                var level = Number(args[1])
                if(!args[1]) {
                    return message.channel.send("Invalid format! Example: '!star large 70'");
                }
                if(isNaN(level)) {
                    return message.channel.send("Invalid format! Example: '!star large 70'");
                } else {
                    return message.channel.send("For a " + args[0] + " prismatic star you will get " + stars[args[0]][level] + " bonus experience at level " + level);
                }
                return message.channel.send("Invalid format! Example: '!star large 70'");
            } else {
                return message.channel.send("Invalid format! Example: '!star large 70'");
            }
        } else {
            message.reply("You can only use the prismatic star command in the #bot-channel");
        }
    }
});

client.login(config.token);