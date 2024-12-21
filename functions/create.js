
const Bots = require("../models/bot.js");
const Users = require("../models/user.js");
const Servers = require("../models/server.js");
module.exports= {


    bot: async function(id){
        var bot = await Bots.create({
            id: id,
            color: "#FF69B4",
            status: ".gg/x",
            boosterRole: "967876333029957773"
        })
        return bot;
    },

    user: async function(id){
        var data = await Users.create({
            id: id,
           
        })

        return data;
    },

    
    server: async function(id){
        var data = await Servers.create({
            id: id,
            disabled: []
        })
        return data;
    },
}
