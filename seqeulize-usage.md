# Sequelize Usage
writen 18.03.18 by jonghwa

보시다 시피 옜날에 정리해눈거라서 최신 버전 정리는 아닙니다 .. ㅎㅎ..

docs : <http://docs.sequelizejs.com>

sequelize Upgrade to V4 example



```javascript
models.sequelize.sync().then(() => {
}).catch(err => {
})

//OR

models.sequelize.sync({force:true}).then(() => {
}).catch(err => {
})
```



# 1. index.js



```javascript
'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

```



# 2 .Model define

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    user_no: {
      type: DataTypes.INTEGER, primaryKey: true
      , allowNull: false, autoIncrement: true},
    user_id: { type: DataTypes.STRING, unique: true, allowNull: false, },
    user_password: { type: DataTypes.STRING, allowNull: false },
  }, {
      freezeTableName: true,
      tableName: "tbl_user",
      underscored: true,
      timestamps: false
    });
  User.associate = function (models) {
    User.belongsTo(models.UserGrade, { foreignKey: 'usergrade_no' });
    User.hasMany(models.Board, { foreignKey: 'board_user_no', sourceKey: 'user_no' });
  };

  return User;
};
```



# 3. Association

## 3.1 BelongsTo

두개의 모델에 1개의 외래키로 연결된다.

기본적으로 belongsto으로 생성되는 외래키는 대상모델의 이름과 대상 기본키 이름으로 생성됨

{foreignKey: 'fk_company'} 컬럼명 지정

{targetKey: 'name'} 대상키 지정



## 3.2 hasOne

일대일 관계에 대한 외래키가 대상모델에 존재하는 연관

HasOne 연관이라고해도, 대부분의 1 : 1 관계에 대해 BelongsTo는 hasOne이 대상에 추가 할 소스에 foreignKey를 추가하기 때문에 일반적으로 BelongsTo 연결을 원합니다.



## Difference between HasOne and BelongsTo

In Sequelize 1:1 relationship can be set using HasOne and BelongsTo. They are suitable for different scenarios. Lets study this difference using an example.

Suppose we have two tables to link **Player** and **Team**. Lets define their models.

```javascript
const Player = this.sequelize.define('player', {/* attributes */})
const Team  = this.sequelize.define('team', {/* attributes */});
```

When we link two models in Sequelize we can refer them as pairs of **source** and **target** models. Like this

Having **Player** as the **source** and **Team** as the **target**

```javascript
Player.belongsTo(Team);
//Or
Player.hasOne(Team);
```

Having **Team** as the **source** and **Player** as the **target**

```javascript
Team.belongsTo(Player);
//Or
Team.hasOne(Player);
```

HasOne and BelongsTo insert the association key in different models from each other. HasOne inserts the association key in **target** model whereas BelongsTo inserts the association key in the **source** model.

Here is an example demonstrating use cases of BelongsTo and HasOne.

```javascript
const Player = this.sequelize.define('player', {/* attributes */})
const Coach  = this.sequelize.define('coach', {/* attributes */})
const Team  = this.sequelize.define('team', {/* attributes */});
```

Suppose our `Player` model has information about its team as `teamId` column. Information about each Team's `Coach` is stored in the `Team` model as `coachId` column. These both scenarios requires different kind of 1:1 relation because foreign key relation is present on different models each time.

When information about association is present in **source** model we can use `belongsTo`. In this case `Player` is suitable for `belongsTo` because it has `teamId` column.

```javascript
Player.belongsTo(Team)  // `teamId` will be added on Player / Source model

```

When information about association is present in **target** model we can use `hasOne`. In this case `Coach` is suitable for `hasOne` because `Team` model store information about its `Coach` as `coachId` field.

```javascript
Coach.hasOne(Team)  // `coachId` will be added on Team / Target model
```



## 3.3 hasMany

```javascript
default : Project.hasMany(User, {as: 'Workers'})
타겟키와 소스키 지정 선언
Country.hasMany(City, {foreignKey: 'countryCode', sourceKey: 'isoCode'});
City.belongsTo(Country, {foreignKey: 'countryCode', targetKey: 'isoCode'});
```



## 3.4 belongsToMany

```javascript
Project.belongsToMany(User, {through: 'UserProject'});
User.belongsToMany(Project, {through: 'UserProject'});
```

This will create a new model called UserProject with the equivalent foreign keys projectId and userId
through : n:m관계에서 생성되는 새로운 모델



##3.5 Code Exapmle

시퀄라이즈 버전 4에 맞게 작성한 코드입니다.

this code version is Sequelize  V4



### 3.5.1 BelongsTo

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
    var Board = sequelize.define('Board', {
        board_no: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        board_title: { type: DataTypes.STRING, allowNull: false },
        board_content: { type: DataTypes.TEXT, allowNull: false },
        board_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: '0' },
    }, {
            freezeTableName: true,
            tableName: "tbl_board",
            underscored: true,
            timestamps: true
        });
    Board.associate = function (models) {
        Board.belongsTo(models.Category, { foreignKey: 'board_category' });
        Board.belongsTo(models.Department, { foreignKey: 'board_department' });
        Board.belongsTo(models.Department, { foreignKey: 'board_user_id' });
    };
    return Board;
};
```



### 3.5.2 hasMany

```javascript
'use strict';
module.exports = (sequelize, DataTypes) => {
    var Category = sequelize.define('Category', {
        category_id: {
            type: DataTypes.INTEGER, primaryKey: true
            , allowNull: false, autoIncrement: true },
        category_name: {
            type: DataTypes.STRING, allowNull: false, unique: true },
    }, {
            freezeTableName: true,
            tableName: "tbl_category",
            underscored: true,
            timestamps: false
        });
    Category.associate = function (models) {
        Category.hasMany(models.Board, { foreignKey: 'board_category', sourceKey: 'category_id' });
        
    };
    return Category;
};
```



### 3.5.3 belongsToMany

### basic

subject.associate = function (models) {

```javascript
subject.associate = function (models) {
    subject.belongsToMany(models.Student, {
        through: {
            model: 'tbl_listen'
        }
    })
}

Student.associate = function (models) {
    Student.belongsToMany(models.subject, {
        through: {
            model: 'tbl_'
        }
    });
};
```


### 기존 테이블 사용하기

```javascript
subject.associate = function (models) {
    subject.belongsToMany(models.Student, {
        through: {
            model: models.listen
        }
        , foreignKey: 'subject_no'
    })
}

Student.associate = function (models) {
    Student.belongsToMany(models.subject, {
        through: {
            model: models.listen
        }
        ,foreignKey: 'student_no'
    })
};
```



## 3.6 Sequlize Upgrade to V4

Previous:

```javascript
const Model = sequelize.define('Model', {
    ...
}, {
    classMethods: {
        associate: function (model) {...}
    },
    instanceMethods: {
        someMethod: function () { ...}
    }
});

```

New:

```javascript
const Model = sequelize.define('Model', {
    ...
});

// Class Method
Model.associate = function (models) {
    ...associate the models
};

// Instance Method
Model.prototype.someMethod = function () {..}
```

# 4. Query

## 4.1 find

```javascript
models.User.find({
            where: { user_id: body.id, user_password: body.password }
        }).then(result => {
        }).catch(err => {
        });
```



## 4.2 findAll

```javascript
models.Board.findAll({
            where: { board_category: board_notice },
            limit: 5,
            order: [['created_at', 'DESC']]
        }).then(result => {
        }).catch(err => {
        });
```



## 4.3 create

```javascript
models.User.create({
                user_id: body.id,
                user_password: body.password,
                usergrade_no: body.grade
            }).then(result => {
            }).catch(err =>) {
            });
```



## 4.4 update

```javascript
models.Board.update({
      board_title: body.title, 
      board_content: body.content, 
      board_department: body.board_department
    } , {where: { board_no: paramId }
      }).then((result) => {
      }).catch((err) => {
      });
```



## 4.5 delete

```javascript
models.Board.destroy({
      where: { board_no: result.board_no }
    }).then((result) => {
    }).catch((err) => {
    });
```

# 5. Transaction

```javascript
return models.sequelize.transaction((t) => {
            const body = req.body;
    
            return models.User.create({
                user_id: body.id,
                user_password: body.password,
                usergrade_no: body.grade
            }, { transaction: t })
        }).then((result) => {
        }).catch((err) => {
        });
```

# 6. Promise use multi query

```javascript
 models.sequelize.Promise.all([
            models.Board.findAll({
                where: { board_category: board_notice },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
            models.Board.findAll({
                where: { board_category: board_faq },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
            models.Board.findAll({
                where: { board_category: board_community },
                limit: 5,
                order: [['created_at', 'DESC']]
            }),
        ])
            .spread((returnNotice, returnFAQ, returnCommunity) => {
            }).catch(function (err) {
            });
```



## 6.1 Difference Between then(...).catch(...) and spread(...).fail(...)

then is for functions returning a single arg, spread is for functions returning multiple, eg findorcreate