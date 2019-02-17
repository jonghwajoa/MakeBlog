module.exports = (sequelize, DataTypes) => {
  const Tags = sequelize.define(
    'Tags',
    {
      no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: {
            min: 1,
            max: 100,
            msg: 'Tag 이름의 길이는 1 이상 100 이하 입니다.',
          },
        },
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_tags',
      underscored: true,
      timestamps: false,
      paranoid: false,
    },
  );

  /*  Associate */
  Tags.associate = function(models) {
    Tags.belongsToMany(models.Posts, { through: 'tbl_post_tag', foreignKey: 'tag_no', timestamps: false });
  };

  /* instance Method */

  Tags.prototype.getNo = function() {
    return this.no;
  };

  /* class Method */

  Tags.findByTest = name => {
    return Tags.findOne({
      where: {
        name,
      },
    });
  };

  Tags.createByName = name => {
    return Tags.create({
      name,
    });
  };

  Tags.updateOrCreateByName = name => {
    return Tags.findOne({
      where: {
        name,
      },
    }).then(result => {
      if (!result) {
        return Tags.create({
          name,
        });
      }
    });
  };

  Tags.findOrCreateByName = name => {
    return Tags.findOrCreate({
      where: {
        name,
      },
      attributes: ['no'],
    });
  };

  return Tags;
};
