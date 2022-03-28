const path          = require('path');
const fs            = require('fs');
require('dotenv').config({path:__dirname+'/config.env'}); //initialize dotenv
const Discord       = require('discord.js-self'); //import discord.js
const client        = new Discord.Client(); //create new client
const player = require('play-sound')(opts = {});

//constants
const BAGACEIRA_CHANNEL_POKEMEOW_ID = "910643877273280534"
const POKEMEOW_BOT_ID = "664508672713424926"
const POKEMEOWHELPER_BOT_ID = "833428629705719828"

const SUPER_RARE = "16315399"
const RARE = "16484616"
const UNCOMMON = "1291495"
const COMMON = "546299"

const CAPTCHA_CODE_SOUND = "pikachu.mp3"
//https://play.pokemonshowdown.com/audio/cries/

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}: ${client.user}!`);
    console.log(client.user)
});


/*
message structure:
{
    "channelID":"940157271470637066",
    "deleted":false,
    "id":"955282976013434901",
    "type":"DEFAULT",
    "content":"Pb",
    "authorID":"954408098553012254",
    "pinned":false,
    "tts":false,
    "nonce":"961453757269278720",
    "system":false,
    "embeds":[],
    "attachments":[],
    "createdTimestamp":1647827609781,
    "editedTimestamp":null,
    "webhookID":null,
    "applicationID":null,
    "activity":null,
    "flags":0,
    "reference":null,
    "guildID":"664509279251726363",
    "cleanContent":"Pb"
}
*/

client.on('message', msg => {
    let msgJson = JSON.stringify(msg)
    if (msg.channel.id == BAGACEIRA_CHANNEL_POKEMEOW_ID) {
        handleResponseOnBagaceiraPokemeow(msg)
        //if (msg.author.id == client.user.id) { msg.reply("msadsadsa") }
    }
});

//make sure this line is the last line
client.login(process.env.DISCORD_CLIENT_TOKEN)

//-------------

function getAnswerOnPokemonRarity(rarityColor) {
    switch (String(rarityColor)) {
        case SUPER_RARE:
            console.log('SUPER Rare pkm found, use ub\n');
            return "ub"
        case RARE:
            console.log('RARE pkm found, use ub\n');
            return "ub"
        case UNCOMMON:
            console.log('UNCOMMON pkm found, use gb\n');
            return "gb"
        case COMMON:
            console.log('COMMON pkm found, use pb\n');
            return "pb"
        default:
            //Legendary or Shiny
            console.log(`Pkm legendary, galarian or shiny found!: ${rarityColor}\n`);
            return "mb"
    }
}

function handleResponseOnBagaceiraPokemeow(msg) {
    let randomDelayAnswer = Math.ceil(Math.random()*2300)
    console.log(`Got response) Author: ${msg.author}, Channel: ${msg.channel}\nMessage: ${msg.content}\n`)
    if  (
            msg.author.id == POKEMEOWHELPER_BOT_ID && 
            (msg.content.indexOf(`${client.user.username}**\`, your ;p`) != -1) &&
            (msg.content.indexOf("ready") != -1)
        ) {
        setTimeout(() => {
            msg.channel.send(";p")
        }, randomDelayAnswer);
        //executeSafely(msg.channel.send, randomDelayAnswer, ";p");
    } else if (msg.author.id == POKEMEOW_BOT_ID && (msg.content.indexOf(`${client.user.username}** found`) != -1)) {
        try {
            let msgAttached = msg.embeds[0]
            let response = getAnswerOnPokemonRarity(msgAttached.color)
            setTimeout(() => {
                msg.channel.send(response)
            }, randomDelayAnswer);
        }
        catch(err) {
            console.log(`\nError on msgAttached: ${msgAttached}`)
            console.log(err)
            console.log(`\n`)
        }
        //executeSafely(msg.channel.send, randomDelayAnswer, response)
        //console.log(msgAttached)
        //console.log(msgJson)
    } else if (
        msg.author.id == POKEMEOW_BOT_ID &&
        (msg.content.indexOf(`<@${client.user.id}>, please respond with`) != -1) &&
        (msg.content.indexOf(`game ban`) != -1)
        ) {
            console.log("CAPTCHA CODE")
            msg.channel.send(`1203013`)
            player.play(`./media/${CAPTCHA_CODE_SOUND}`, function(err){
                if (err) throw err 
            })
            //TODO: mark user
            //msg.channel.send(`@${client.user.id}, @${client.user.username}`)
        }
}

function executeSafely(fun, delay, extraArgs) {
    setTimeout(() => {fun(extraArgs)}, delay);
}