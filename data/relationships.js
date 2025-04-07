const Users = require("../models/users");
const Roles = require("../models/roles");
const Profiles = require("../models/profiles");
const Sections = require("../models/sections");
const Details = require("../models/details");
const Cards = require("../models/cards");
const Buttons = require("../models/buttons");
const Statistics = require("../models/statistics");


// Kullanıcı ile Profil arasındaki ilişki (Bir Kullanıcı -> Bir Profil)
Profiles.belongsTo(Users, { foreignKey: "userId" });
Users.hasMany(Profiles, { foreignKey: "userId" });

// Profil ile Alanlar (Sections) arasındaki ilişki (Bir Profil -> Birçok Alan)
Sections.belongsTo(Profiles, { foreignKey: "profileId" });
Profiles.hasMany(Sections, { foreignKey: "profileId" });

// Alanlar ile Bilgiler (Details) arasındaki ilişki (Bir Alan -> Birçok Bilgi)
Details.belongsTo(Sections, { foreignKey: "sectionId" });
Sections.hasMany(Details, { foreignKey: "sectionId" });

// Kullanıcı ile Kartlar (Cards) arasındaki ilişki (Bir Kullanıcı -> Birçok Kart)
Cards.belongsTo(Users, { foreignKey: "userId" });
Users.hasMany(Cards, { foreignKey: "userId" });

Cards.belongsTo(Profiles, { foreignKey: "profileId" });     
Profiles.hasMany(Cards, { foreignKey: "profileId" });


Users.belongsToMany(Roles, { through: 'userRoles'});
Roles.belongsToMany(Users, { through: 'userRoles'});

Profiles.hasMany(Statistics, { foreignKey: 'profileId' });
Statistics.belongsTo(Profiles, { foreignKey: 'profileId' });

Buttons.belongsTo(Profiles, { foreignKey: "profileId", onDelete: "CASCADE" });
Profiles.hasMany(Buttons, { foreignKey: "profileId" });