const dbConfig = require('../config/db.config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB, 
    dbConfig.USER, 
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAlias: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        },
    });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define semua models yang ada pada aplikasi
db.books = require('./book.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.user = require('./user.model')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: 'user_roles',
    foreygnKey: 'roleId',
    otherKey: 'userId'
});
db.user.belongsToMany(db.role, {
    through: 'user_roles',
    foreygnKey: 'userId',
    otherKey: 'roleId'
});
db.ROLES = ['user', 'admin', "moderator"];

module.exports = db;