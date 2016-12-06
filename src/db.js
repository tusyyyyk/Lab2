var Sequelize = require("sequelize");

var sequelize = new Sequelize('market', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var db = {
    sequelize: sequelize,

    User: sequelize.define('user', {
        login: {type: Sequelize.STRING},
        password: {type: Sequelize.STRING}
    }),

    Product: sequelize.define('product', {
        name: {type: Sequelize.STRING},
        description: {type: Sequelize.STRING},
        image: {type: Sequelize.STRING}
    }),

    Income: sequelize.define('income', {
        date: {type: Sequelize.DATE},
        price: {type: Sequelize.INTEGER},
        count: {type: Sequelize.INTEGER}
    }),

    Order: sequelize.define('order', {
        date: {type: Sequelize.DATE}

    }),
    OrderProduct: sequelize.define('OrderProducts', {
        count: {type: Sequelize.INTEGER}
    })
};

module.exports = db;

db.Product.hasMany(db.Income);

db.Product.belongsToMany(db.Order, {through: 'OrderProducts'});
db.Order.belongsToMany(db.Product, {through: 'OrderProducts'});

db.User.hasMany(db.Order);

sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function(){
        return sequelize.sync({ force: true });
    })
    .then(function(){
        return sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(function(){
        console.log('Database synchronised.');

        var fakeProducts = [];
        for(var i=1;i<=40;i++)
        {
            fakeProducts.push({name:"Product"+i,
                               description:"dashd adhasd asdghjgasd asdashd asdgjasd asdhg asdhsagd asdgasd adhg",
                                image:"/images/"+i+".jpg"});
        }

        return db.Product.bulkCreate(fakeProducts);
    }, function(err){
        console.log(err);
    })
    .then(function () {
        var fakeIncomes = [];
        for(var i=1;i<=40;i++)
        {
            var price = Math.round(Math.random()*10)*100+500;
            fakeIncomes.push({date: new Date(new Date().getTime() - 20*24*60*60*1000),
                count: Math.round(Math.random()*100),
                price: price,
                productId: i});

            fakeIncomes.push({date: new Date(new Date().getTime() - 4*24*60*60*1000),
                count: Math.round(Math.random()*100),
                price: price*1.25,
                productId: i});
        }
        return db.Income.bulkCreate(fakeIncomes);
    }).then(function () {
        db.User.bulkCreate([{name:'admin', password:'1'}, {name:'guest', password:'1'}])
    });