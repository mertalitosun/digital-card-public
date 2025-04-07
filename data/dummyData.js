
const Users = require("../models/users");
const Roles = require("../models/roles");
const Profiles = require("../models/profiles");
const Sections = require("../models/sections");
const Details = require("../models/details");
const Cards = require("../models/cards");
const bcrypt = require("bcrypt");

const uniqid = require("uniqid");
const crypto = require("crypto");
const randomId = (code) => {
    id = crypto.randomBytes(4).toString("hex").toUpperCase();

    return code + id
};
const dummyData = async () => {
    const roleCount = await Roles.count();
    if (roleCount === 0) {
        const roles = await Roles.bulkCreate([
            { name: "Admin" },
            { name: "Müşteri" },
        ]);
        const usersCount = await Users.count();
        if (usersCount === 0) {
            const users = await Users.bulkCreate([
                { userCode: randomId("USR"), name: "Rabia Rana", surname: "İncik", email: "rabiaranaincik@icloud.com", password: await bcrypt.hash("123456", 10),digital_card_max_profiles:5},
                { userCode: randomId("USR"), name: "Mertali", surname: "Tosun", email: "mertali2635@icloud.com", password: await bcrypt.hash("123456", 10),digital_card_max_profiles:5},
            ]);
            await users[0].addRoles([roles[0]]);
            await users[1].addRoles([roles[0]]);
            
            const cardCount = await Cards.count();
            if(cardCount === 0){
                const cards = await Cards.bulkCreate([
                    {cardCode: randomId("INF"),isActive:true},
                    {cardCode: randomId("INF"),isActive:true},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                    {cardCode: randomId("INF"),isActive:false},
                ]);
                await cards[0].setUser(users[0]);
                await cards[1].setUser(users[1]);
            }
        }
    }
};

module.exports = dummyData;