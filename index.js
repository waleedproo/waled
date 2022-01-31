/** @format */

const Discord = require("discord.js");
const Distube = require("distube").default;
const config = require("./config.json");
const client = new Discord.Client({
  intents: 641,
});

const distube = new Distube(client, {
  emitNewSongOnly: false,
  searchSongs: 0,
});
client.on("ready",()=>{
    console.log(`${client.user.username} Is Online`)
    client.user.setActivity("hi", {
      type: "WATCHING",
      url: "https://discord.gg/dEMMKnGyJZ",
    });
    client.user.setUsername("waleed")
    client.user.setStatus("online")
    
})


const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filter || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode == 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// distube events
distube.on("playSong", (queue, song) => {
  let playembed = new Discord.MessageEmbed()
    .setColor("GOLD")
    .setTitle(`🎶 Playing`)
    .setThumbnail(song.thumbnail)
    .setDescription(`[${song.name}](${song.url})`)
    .addField("Requested Bay", `${song.user}`, true)
    .addField("Duration", song.formattedDuration.toString(), true)
    .setFooter(
      `Coded By Waleed`,
      song.user.displayAvatarURL({ dynamic: true })
    );

  queue.textChannel.send({ embeds: [playembed] });
});
distube.on("addSong", (queue, song) => {
  let playembed = new Discord.MessageEmbed()
    .setColor("NAVY")
    .setTitle(`🎶 Added Song`)
    .setThumbnail(song.thumbnail)
    .setDescription(`[${song.name}](${song.url})`)
    .addField("Requested Bay", `${song.user}`, true)
    .addField("Duration", `${song.formattedDuration.toString()}`, true)
    .setFooter(
      `Coded By Waleed`,
      song.user.displayAvatarURL({ dynamic: true })
    );

  queue.textChannel.send({ embeds: [playembed] });
});
distube.on("addList", (queue, plalist) => {
  let playembed = new Discord.MessageEmbed()
    .setColor("BLURPLE")
    .setTitle(`🎵 PlayList Added to Queue `)
    .setThumbnail(plalist.thumbnail)
    .setDescription(`[${plalist.name}](${plalist.url})`)
    .addField("Requested By", `${plalist.user}`, true)
    .addField("Duration", `${plalist.formattedDuration.toString()}`, true)
    .setFooter(
      `Coded By Waleed`,
      plalist.user.displayAvatarURL({ dynamic: true })
    );

  queue.textChannel.send({ embeds: [playembed] });
});
client.on("messageCreate", async (message) => {
  if (
    !message.guild ||
    message.author.bot ||
    !message.content.startsWith(config.prefix)
  )
    return;
  let args = message.content.slice(config.prefix.length).trim().split(" ");
  let cmd = args.shift()?.toLowerCase();
  if (cmd === "ping") {
    message.channel.send(`>>> ping:-\`${client.ws.ping}\` `);
  } else if (cmd === "play") {
    let search = args.join(" ");
    let channel = message.member.voice.channel;
    let queue = distube.getQueue(message.guildId);
    if (!channel) {
      return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription("***`ادخل روم صوتى الاول` ***")
            .setFooter(
              `Coded BY WALEED`,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    }
    // if (message.guild.me.voice.channel !== channel) {
    //   return message.reply({
    //     embeds: [
    //       new Discord.MessageEmbed()
    //         .setColor("BLUE")
    //         .setDescription("***`ادخل روم صوتى الاول` ***")
    //         .setFooter(
    //           `CODED BY ***_WALEED_***`,
    //           message.author.displayAvatarURL({ dynamic: true })
    //         ),
    //     ],
    //   });
    // }
    if (!search) {
      return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("***`اكتب اسم الاغنية`***")

            .setFooter(
              `Coded BY WALEED`,
              message.author.displayAvatarURL({ dynamic: true })
            ),
        ],
      });
    }
    distube.play(message, search);
  } else if (cmd === "skip") {
    let queue = distube.getQueue(message.guild.id);
    let channel = message.member.voice.channel;
    if (!channel) {
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle(`لازم تبقى ف روم صوتى`)
            .setDescription(`Song Changed By ${message.author}`)
            .setFooter(`Coded By Waleed`),
        ],
      });
      return;
    }
    if (!queue) {
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle(`مفيش اغانى شغاله`)
            .setDescription(`Song Changed By ${message.author}`)
            .setFooter(`Coded By Waleed`),
        ],
      });
      return;
    }
    queue.skip();
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
          .setColor("BLUE")
          .setTitle(`skibed Song`)
          .setDescription(`Song Changed By ${message.author}`)
          .setFooter(`Coded By Waleed`),
      ],
    });
    return;
  } else if (cmd === "pause") {
    let queue = distube.getQueue(message.guild.id);
    let channel = message.member.voice.channel;
    if (!channel) {
      return message.channel.send(`** لازم تبقى ف روم صوتى  **`);
    }
    if (!queue.songs.length) {
      return message.channel.send(`** مفيش  اغانى شغاله **`);
    }
    queue.pause();
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
          .setColor("BLURPLE")
          .setTitle(`Song Pause`)
          .setDescription(`Song Paushed by ${message.author}`)
          .setFooter(`Coded by waleed`),
      ],
    });
  } else if (cmd === "resume") {
    let queue = distube.getQueue(message.guild.id);
    let channel = message.member.voice.channel;
    if (!channel) {
      return message.channel.send(`** لازم تبقى ف روم صوتى  **`);
    }
    if (!queue.songs.length) {
      return message.channel.send(`** مفيش  اغانى شغاله **`);
    }
    queue.resume();
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
          .setColor("BLURPLE")
          .setTitle(`Song Resume`)
          .setDescription(`Song Resumed by ${message.author}`)
          .setFooter(`Coded by waleed`),
      ],
    });
  } else if (cmd === "queue") {
    let queue = distube.getQueue(message.guild.id);
    let channel = message.member.voice.channel;
    if (!channel) {
      return message.channel.send(`** لازم تبقى ف روم صوتى  **`);
    }
    if (!queue.songs.length) {
      return message.channel.send(`** مفيش  اغانى شغاله **`);
    }
    if (queue.playing) {
      let embedsc = queue.songs.map((song, index) => {
        return `${index + 1} [${song.name}](${song.url}) \`[${
          song.formattedDuration
        }]\``;
      });

      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`Queue Of \`${message.guild.name}\``)
            .setDescription(`>>> ${embedsc.join("\n")}`.substr(0, 3000))
            .setFooter(
              `${queue.songs.length} Songs`,
              message.guild.iconURL({ dynamic: true })
            ),
        ],
      });
    }
  } else if (cmd === "np") {
    let queue = distube.getQueue(message.guild.id);
    if (!queue.songs.length) {
      return message.channel.send(`** مفيش  اغانى شغاله **`);
    }
    let song = queue.songs[0];
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Now Playing`, song.thumbnail)
      .setColor("BLURPLE")
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .addFields([
        {
          name: "**Duration**",
          value: `>>> ${song.formattedDuration.toString()}`,
          inline: true,
        },
        {
          name: "**User**",
          value: `>>> ${song.user}`,
          inline: true,
        },
        {
          name: "**Views**",
          value: `>>> ${song.views.toLocaleString()}`,
          inline: true,
        },
      ]);

    message.channel.send({ embeds: [embed] });
  } else if (cmd === "loop") {
    let queue = distube.getQueue(message.guild.id);
    let loop = args[0];
    if (loop === "song") {
      if (!queue.songs.length) {
        return message.reply(`Noting playing`);
      }
      if (queue.repeatMode === 1) {
        return message.reply(`Song is already in loop`);
      }
      queue.setRepeatMode(1);
      return message.reply(`Song is Looped`);
    } else if (loop === "queue") {
      if (!queue) {
        return message.reply(`Noting playing`);
      }
      if (queue.repeatMode === 2) {
        return message.reply(`Queue is already in loop`);
      }
      queue.setRepeatMode(2);
      return message.reply(`Queue is Looped`);
    } else if (loop === "off") {
      if (!queue) {
        return message.reply(`Noting playing`);
      }
      if (queue.repeatMode === 0) {
        return message.reply(`Loop is Alraday Disabled`);
      }
      queue.setRepeatMode(2);
      return message.reply(`Loop is Off`);
    } else {
      return message.channel.send(`Choose This:-\`song\`,\`queue\`,\`off\``);
    }
  } else if (cmd === "vol") {
    let amount = parseInt(args[0]);
    let queue = distube.getQueue(message.guild.id);
    queue.setVolume(amount);
    message.channel.send(`>>>VOLUME set to ${amount}`);
  }
});

client.login(config.token);
