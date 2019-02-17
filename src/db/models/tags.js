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
      },
      count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
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

  Tags.associate = function(models) {
    Tags.belongsToMany(models.Posts, { through: 'tbl_post_tag', foreignKey: 'tag_no', timestamps: false });
  };

  Tags.prototype.getNo = function() {
    return this.no;
  };

  Tags.prototype.getCount = function() {
    return this.count;
  };

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

  Tags.findOrCreateByName = (name, transaction) => {
    return Tags.findOrCreate({
      where: {
        name,
      },
      attributes: ['no'],
      transaction,
    });
  };

  return Tags;
};
